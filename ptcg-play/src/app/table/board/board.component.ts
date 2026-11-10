import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, NgZone, OnDestroy, Output, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DraggedItem } from '@ng-dnd/sortable';
import { DropTarget, DndService } from '@ng-dnd/core';
import { Observable, Subscription } from 'rxjs';
import { Player, SlotType, PlayerType, CardTarget, Card, CardList, PokemonCard, PokemonCardList, Stage, StateUtils, SuperType } from 'ptcg-server';
import { map } from 'rxjs/operators';

import { HandItem, HandCardType } from '../hand/hand-item.interface';
import { BoardCardItem, BoardCardType } from './board-item.interface';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { GameService } from '../../api/services/game.service';
import { LocalGameState } from 'src/app/shared/session/session.interface';
import { SettingsService } from '../../shared/services/settings.service';
import { BoardInteractionService } from '../../shared/services/board-interaction.service';
import { activeCardSize, portraitBenchLayout } from './portrait-bench-layout';

const MAX_BENCH_SIZE = 8;
const DEFAULT_BENCH_SIZE = 5;

/** Visual offsets only: retain the full pile depth with at most three layers. */
export function pileLayerIndices(count: number): number[] {
  if (!count) { return []; }
  if (count <= 3) { return Array.from({ length: count }, (_, index) => index); }
  return [0, Math.floor((count - 1) / 2), count - 1];
}

type DropTargetType = DropTarget<DraggedItem<HandItem> | BoardCardItem, any>;

@Component({
  selector: 'ptcg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {

  @Input() gameState: LocalGameState;
  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;
  @Input() player: Player;
  @Input() clientId: number;
  @Input() isHandHidden: boolean = false;
  @Input() canEndTurn = false;
  @Output() deckClick = new EventEmitter<Card>();
  @Output() discardClick = new EventEmitter<Card>();
  @Output() toggleHand = new EventEmitter<void>();
  @Output() endTurn = new EventEmitter<void>();

  public deck: CardList;
  public discard: CardList;
  public isOwner: boolean;
  public readonly defaultBenchSize = DEFAULT_BENCH_SIZE;
  public topBench = new Array(MAX_BENCH_SIZE);
  public bottomActive: BoardCardItem;
  public bottomBench: BoardCardItem[];
  public activePlayer: Player;
  public boardTarget: DropTargetType;
  public boardHighlight$: Observable<boolean>;
  public bottomActiveTarget: DropTargetType;
  public bottomActiveHighlight$: Observable<boolean>;
  public bottomBenchTarget: DropTargetType[];
  public bottomBenchHighlight$: Observable<boolean>[];
  public benchTarget: DropTargetType;
  public benchHighlight$: Observable<boolean>;
  public isUpsideDown: boolean = false;
  public stateUtils = StateUtils;
  @HostBinding('class.compact-board') public isCompact = false;
  @HostBinding('class.landscape-board') public isLandscape = false;
  private topBenchColumns = DEFAULT_BENCH_SIZE;
  private bottomBenchColumns = 3;
  private resizeObserver?: ResizeObserver;
  private settingsSubscription: Subscription;
  private cardScale = 1;
  private benchOrderGameId?: number;
  private benchOrders = new Map<number, number[]>();
  private benchOrderSnapshots = new Map<string, Map<number, number[]>>();
  private initialBenchSnapshot?: string;

  // Add these for use in the template
  public PlayerType = PlayerType;
  public SlotType = SlotType;


  get isTopPlayerActive(): boolean {
    return this.gameState?.state?.players[this.gameState.state.activePlayer]?.id === this.topPlayer?.id;
  }

  get isBottomPlayerActive(): boolean {
    return this.gameState?.state?.players[this.gameState.state.activePlayer]?.id === this.bottomPlayer?.id;
  }

  // Get the active stadium card and its owner
  get stadiumCard(): CardList {
    // If top player has a stadium card, use it
    if (this.topPlayer?.stadium?.cards?.length > 0) {
      return this.topPlayer.stadium;
    }
    // If bottom player has a stadium card, use it
    if (this.bottomPlayer?.stadium?.cards?.length > 0) {
      return this.bottomPlayer.stadium;
    }
    // No stadium card is in play
    return null;
  }

  // Determine who owns the active stadium
  get stadiumOwner(): boolean {
    if (!this.stadiumCard) return false;

    // Check if it belongs to top player
    if (this.topPlayer?.stadium?.cards?.length > 0) {
      return this.topPlayer.id === this.clientId;
    }

    // Check if it belongs to bottom player
    if (this.bottomPlayer?.stadium?.cards?.length > 0) {
      return this.bottomPlayer.id === this.clientId;
    }

    return false;
  }

  constructor(
    private cardsBaseService: CardsBaseService,
    private dnd: DndService,
    private gameService: GameService,
    private settingsService: SettingsService,
    private boardInteractionService: BoardInteractionService,
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone
  ) {

    this.settingsSubscription = this.settingsService.cardSize$.subscribe(size => {
      this.cardScale = size / 100;
      this.updateLayout();
    });

    // Bottom Player
    this.bottomActive = this.createBoardCardItem(PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE);
    [this.bottomActiveTarget, this.bottomActiveHighlight$] = this.initDropTarget(PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE);

    this.bottomBench = [];
    this.bottomBenchTarget = [];
    this.bottomBenchHighlight$ = [];
    for (let i = 0; i < MAX_BENCH_SIZE; i++) {
      const item = this.createBoardCardItem(PlayerType.BOTTOM_PLAYER, SlotType.BENCH, i);
      this.bottomBench.push(item);
      let target: DropTargetType;
      let highlight$: Observable<boolean>;
      [target, highlight$] = this.initDropTarget(PlayerType.BOTTOM_PLAYER, SlotType.BENCH, i);
      this.bottomBenchTarget.push(target);
      this.bottomBenchHighlight$.push(highlight$);
    }

    // Dropping
    [this.boardTarget, this.boardHighlight$] = this.initDropTarget(PlayerType.ANY, SlotType.BOARD);
    [this.benchTarget, this.benchHighlight$] = this.initBenchDropTarget();
  }

  // Add property to track deck size
  public deckSize: number = 0;
  public discardSize: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (this.player) {
      this.deck = this.player.deck;
      this.discard = this.player.discard;
      this.isOwner = this.player.id === this.clientId;
      // Update deck size when deck changes
      this.deckSize = this.deck.cards.length;
      this.discardSize = this.discard.cards.length;
    } else {
      this.deck = undefined;
      this.discard = undefined;
      this.isOwner = false;
      this.deckSize = 0;
      this.discardSize = 0;
    }

    this.updateBenchOrder();
    this.updateLayout();
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => this.zone.run(() => this.updateLayout()));
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  public benchSize(player: Player): number {
    return player?.bench?.length || DEFAULT_BENCH_SIZE;
  }

  public benchColumns(player: Player): number {
    const capacity = this.benchSize(player);
    if (!this.isCompact) { return capacity; }
    return player === this.topPlayer ? this.topBenchColumns : this.bottomBenchColumns;
  }

  public benchRows(player: Player): number {
    return this.isCompact ? Math.ceil(this.benchSize(player) / this.benchColumns(player)) : 1;
  }

  private updateBenchOrder(): void {
    if (this.benchOrderGameId !== this.gameState?.gameId) {
      this.benchOrderGameId = this.gameState?.gameId;
      this.benchOrders.clear();
      this.benchOrderSnapshots.clear();
      this.initialBenchSnapshot = undefined;
    }
    const snapshot = this.gameState?.stateData;
    const restored = snapshot && this.benchOrderSnapshots.get(snapshot);
    if (restored) {
      this.benchOrders = new Map(restored);
      return;
    }
    for (const player of [this.topPlayer, this.bottomPlayer]) {
      if (!player) { continue; }
      const occupied = player.bench.map((slot, index) => index).filter(index => player.bench[index].cards.length > 0);
      const previous = this.benchOrders.get(player.id) || [];
      this.benchOrders.set(player.id, previous.filter(index => occupied.includes(index))
        .concat(occupied.filter(index => !previous.includes(index))));
    }
    if (snapshot) {
      // Keep the initial order for Reset and recent orders for the engine's 30-action Undo history.
      this.initialBenchSnapshot = this.initialBenchSnapshot || snapshot;
      this.benchOrderSnapshots.set(snapshot, new Map(this.benchOrders));
      if (this.benchOrderSnapshots.size > 100) {
        const oldest = Array.from(this.benchOrderSnapshots.keys()).find(key => key !== this.initialBenchSnapshot);
        this.benchOrderSnapshots.delete(oldest);
      }
    }
  }

  public benchSlotArea(player: Player, index: number): string {
    const bench = player?.bench || [];
    const occupied = !!bench[index]?.cards.length;
    const order = this.benchOrders.get(player?.id) || [];
    const position = occupied ? order.indexOf(index)
      : order.length + bench.slice(0, index).filter(slot => !slot.cards.length).length;
    const columns = this.benchColumns(player);
    const row = Math.floor(position / columns);
    const column = position % columns;
    // Only move the rendered cells; drag/drop and selection retain their engine indices.
    // The opponent's field is rotated, so reverse its grid coordinates for visual row order.
    return player === this.topPlayer
      ? `${this.benchRows(player) - row} / ${columns - column}`
      : `${row + 1} / ${column + 1}`;
  }

  public benchRowOffset(player: Player, index: number): number {
    const order = this.benchOrders.get(player?.id) || [];
    const position = order.indexOf(index);
    if (position === -1) { return 0; }
    const columns = this.benchColumns(player);
    const rowStart = Math.floor(position / columns) * columns;
    const rowCount = Math.min(columns, order.length - rowStart);
    // Offset by half of each unused column, reversing for the rotated opponent field.
    return (columns - rowCount) * (player === this.topPlayer ? -1 : 1);
  }

  private updateLayout(): void {
    const host = this.elementRef.nativeElement;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) { return; }
    this.isCompact = width < 990;
    this.isLandscape = this.isCompact && width >= 700 && height < 500;
    const capacities = [this.benchSize(this.topPlayer), this.benchSize(this.bottomPlayer)];
    const handWidth = height <= 500 ? 88 : Math.min(132, Math.max(94, width * 0.29));
    const handHeight = handWidth * 1.37;
    let handSpace = !this.isHandHidden ? handHeight - 2 : 12;
    const cardSize = 60 * this.cardScale;
    const activeSize = activeCardSize(width, height, this.cardScale);
    const activeHeight = activeSize * 1.37;
    let playerGap = this.isLandscape ? 14.3 : 8;
    let boardGap = 8;
    let topSize: number;
    let bottomSize: number;
    let topFieldHeight = 0;
    this.topBenchColumns = capacities[0];
    this.bottomBenchColumns = Math.ceil(capacities[1] / 2);

    if (this.isCompact && !this.isLandscape) {
      const layout = portraitBenchLayout(width, height, this.cardScale, capacities, handSpace);
      this.topBenchColumns = layout.topColumns;
      this.bottomBenchColumns = layout.bottomColumns;
      topSize = layout.topSize;
      bottomSize = layout.bottomSize;
      handSpace = layout.handSpace;
      playerGap = layout.playerGap;
      boardGap = layout.boardGap;
      topFieldHeight = layout.topFieldHeight;
      host.style.setProperty('--top-field-height', `${topFieldHeight}px`);
    } else if (this.isCompact) {
      const rows = (index: number, columns: number) => Math.ceil(capacities[index] / columns);
      const widthLimit = (columns: number, gap: number, own = false) => {
        const fieldWidth = this.isLandscape ? (width - 16 - boardGap) / 2 : width - 16;
        return (fieldWidth - (own ? 100 : 56) - (columns - 1) * gap) / columns;
      };
      let bottomColumns = this.bottomBenchColumns;
      let bottomRows = rows(1, bottomColumns);
      let bottomLimit = Math.min(69 * this.cardScale, widthLimit(bottomColumns, 6, true));
      const topLimit = Math.min(82 * this.cardScale, widthLimit(capacities[0], 4));
      const benchOverhead = (count: number, gap: number) => 12 + (count - 1) * gap;
      const available = () => height - handSpace - 4 - (this.isLandscape ? activeHeight + playerGap
        : 2 * activeHeight + 2 * playerGap + boardGap);
      const ownHeightLimit = () => (available() - benchOverhead(bottomRows, 6)
        - (this.isLandscape ? 0 : 12 + Math.min(54 * this.cardScale, topLimit) * 1.37)) / (bottomRows * 1.37);

      // Tight frames first give up spacing, then expose a shorter hand rail.
      // Neither Active Pokemon nor the edge controls participate in scaling.
      if (ownHeightLimit() < 60 * this.cardScale) {
        playerGap = this.isLandscape ? 14.3 : 4;
        boardGap = 2;
      }
      const minimumHandSpace = this.isLandscape ? 70 : 74;
      if (ownHeightLimit() < 60 * this.cardScale && handSpace > minimumHandSpace) {
        const needed = (60 * this.cardScale - ownHeightLimit()) * bottomRows * 1.37;
        handSpace = Math.max(minimumHandSpace, handSpace - needed);
      }
      // An exceptionally short embedded phone frame cannot hold two full
      // bench rows below the original Active cards. Keep every card visible
      // in one row there, rather than clipping or scrolling the board.
      const minimumOwnHeight = 60 * this.cardScale * bottomRows * 1.37 + benchOverhead(bottomRows, 6);
      const minimumOpponentHeight = this.isLandscape ? 0 : 12 + Math.min(33 * this.cardScale, topLimit) * 1.37;
      if (available() < minimumOwnHeight + minimumOpponentHeight - 0.01) {
        this.bottomBenchColumns = bottomColumns = capacities[1];
        bottomRows = 1;
        bottomLimit = Math.min(69 * this.cardScale, widthLimit(bottomColumns, 6, true));
      }
      bottomSize = Math.min(bottomLimit, Math.max(60 * this.cardScale, ownHeightLimit()));
      const topHeightLimit = (columns: number, ownSize: number) => {
        const topRows = rows(0, columns);
        const ownHeight = ownSize * bottomRows * 1.37 + benchOverhead(bottomRows, 6);
        return (available() - benchOverhead(topRows, 4) - (this.isLandscape ? 0 : ownHeight)) / (topRows * 1.37);
      };
      topSize = Math.min(topLimit, topHeightLimit(capacities[0], bottomSize));

      // Start with option 2's single opponent row. When it makes their cards
      // meaningfully bigger, use a second opponent row. Our modest 69px cards
      // leave that extra room; empty rows never consume the height budget.
      const alternateColumns = Math.ceil(capacities[0] / 2);
      const alternateSize = Math.min(82 * this.cardScale, widthLimit(alternateColumns, 4),
        topHeightLimit(alternateColumns, bottomSize));
      if (alternateSize >= topSize + 4 * this.cardScale) {
        this.topBenchColumns = alternateColumns;
        topSize = alternateSize;
      }
    } else {
      const columns = Math.max(...capacities);
      const widthLimit = (Math.min(width - 24, 1200) - 60 - 4 * cardSize - (columns - 1) * 6) / columns;
      const heightLimit = (height - handSpace - 92 - 2 * activeHeight) / (2 * 1.37);
      topSize = bottomSize = Math.min(82 * this.cardScale, widthLimit, heightLimit);
    }
    if (this.topPlayer?.id === this.clientId) {
      bottomSize = Math.min(bottomSize, topSize);
    }
    topSize = Math.min(topSize, bottomSize);
    const fieldWidth = this.isLandscape ? (width - 16 - boardGap) / 2 : width - 16;
    let topBenchHeight = 0;
    [topSize, bottomSize].forEach((size, index) => {
      const columns = this.isCompact ? [this.topBenchColumns, this.bottomBenchColumns][index] : capacities[index];
      const rows = Math.ceil(capacities[index] / columns);
      const gap = index === 0 && this.isCompact ? 4 : 6;
      const benchHeight = rows * size * 1.37 + (rows - 1) * gap + 12;
      if (index === 0) { topBenchHeight = benchHeight; }
      const benchWidth = columns * size + (columns - 1) * gap + 12;
      const side = index === 0 ? 'top' : 'bottom';
      host.style.setProperty(`--${side}-bench-height`, `${benchHeight}px`);
      host.style.setProperty(`--${side}-bench-shift`, `${Math.max(0, 44 - (fieldWidth - benchWidth) / 2)}px`);
    });
    host.style.setProperty('--shared-zone-y', `${(this.isCompact ? topFieldHeight : activeHeight + playerGap + topBenchHeight) + boardGap / 2}px`);
    host.style.setProperty('--board-side-space', `${this.isCompact ? 8 : (width - Math.min(width - 24, 1200)) / 2}px`);
    host.style.setProperty('--active-card-size', `${activeSize}px`);
    host.style.setProperty('--card-size', `${cardSize}px`);
    host.style.setProperty('--bench-card-size', `${bottomSize}px`);
    host.style.setProperty('--opponent-bench-card-size', `${topSize}px`);
    host.style.setProperty('--hand-space', `${handSpace}px`);
    host.style.setProperty('--player-gap', `${playerGap}px`);
    host.style.setProperty('--board-gap', `${boardGap}px`);
    host.style.setProperty('--max-bench-size', `${Math.max(...capacities)}`);
    host.parentElement?.style.setProperty('--hand-bottom', `${handSpace - handHeight - 38}px`);
  }

  public pileLayerIndices = pileLayerIndices;

  /** Keep ordinary evolution drops on their chosen Pokémon. */
  private matchesEvolutionTarget(card: PokemonCard, index: number): boolean {
    const target = this.bottomPlayer?.bench[index]?.getPokemonCard();
    return !!target && ((target.stage < card.stage && target.name === card.evolvesFrom)
      || target.evolvesTo.includes(card.name)
      || target.evolvesToStage.includes(card.stage)
      || (Array.isArray(target.evolvesFromBase) && target.evolvesFromBase.includes(card.evolvesFrom)));
  }

  private firstAvailableBenchIndex(item: HandItem): number {
    const player = this.bottomPlayer;
    if (!this.gameState || this.gameState.deleted || this.gameState.turnComplete
      || this.gameState.promptMinimized || this.hasActivePrompt()
      || player?.id !== this.clientId
      || this.gameState.state.players[this.gameState.state.activePlayer]?.id !== this.clientId
      || !(item.card instanceof PokemonCard)
      || (item.card.stage !== Stage.BASIC && !item.card.powers.some(power => power.useFromHand && power.useFromHandToBench))
      || !player.playableCardIds?.includes(item.card.id)) {
      return -1;
    }
    return player.bench.findIndex(slot => slot.cards.length === 0);
  }

  private initBenchDropTarget(): [DropTargetType, Observable<boolean>] {
    const target = this.dnd.dropTarget<DraggedItem<HandItem>>([HandCardType], {
      canDrop: monitor => this.firstAvailableBenchIndex(monitor.getItem().data) !== -1,
      drop: monitor => {
        if (monitor.didDrop()) { return; }
        const item = monitor.getItem().data;
        const index = this.firstAvailableBenchIndex(item);
        if (index !== -1) {
          this.handlePlayFromHand(item, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
        }
      }
    });
    return [target, target.listen(monitor => monitor.canDrop() && monitor.isOver())];
  }

  private initDropTarget(
    player: PlayerType,
    slot: SlotType,
    index: number = 0
  ): [DropTargetType, Observable<boolean>] {

    const target = { player, slot, index };
    let dropTarget: DropTargetType;
    let highlight$: Observable<boolean>;

    dropTarget = this.dnd.dropTarget([HandCardType, BoardCardType], {
      canDrop: monitor => {
        const item = monitor.getItem();
        if (!this.gameState) {
          return false;
        }
        const isFromHand = (item as DraggedItem<HandItem>).type === HandCardType;
        if (slot === SlotType.BOARD) {
          return isFromHand;
        }
        if (isFromHand && player === PlayerType.BOTTOM_PLAYER && slot === SlotType.BENCH) {
          const handItem = (item as DraggedItem<HandItem>).data;
          if (handItem.card instanceof PokemonCard && (handItem.card.stage === Stage.BASIC
            || (handItem.card.powers.some(power => power.useFromHand && power.useFromHandToBench)
              && !this.matchesEvolutionTarget(handItem.card, index)))) {
            return this.firstAvailableBenchIndex(handItem) !== -1;
          }
        }
        const boardCard = item as BoardCardItem;
        // Do not drop to the same target
        if (player === boardCard.player
          && slot === boardCard.slot
          && index === boardCard.index) {
          return false;
        }
        return true;
      },
      drop: monitor => {
        const hasDroppedOnChild = monitor.didDrop();
        // Card already dropped on the card slot
        if (hasDroppedOnChild) {
          return;
        }
        const item = monitor.getItem();
        if ((item as DraggedItem<HandItem>).type === HandCardType) {
          const handItem = (item as DraggedItem<HandItem>).data;
          if (player === PlayerType.BOTTOM_PLAYER && slot === SlotType.BENCH && handItem.card instanceof PokemonCard) {
            const isBasic = handItem.card.stage === Stage.BASIC;
            const handBenchAbility = handItem.card.powers.some(power => power.useFromHand && power.useFromHandToBench)
              && !this.matchesEvolutionTarget(handItem.card, index);
            if (isBasic || handBenchAbility) {
              const firstAvailable = this.firstAvailableBenchIndex(handItem);
              if (firstAvailable !== -1) {
                const targetIsEmpty = this.bottomPlayer?.bench[index]?.cards.length === 0;
                this.handlePlayFromHand(handItem, { player, slot,
                  index: !isBasic && targetIsEmpty ? index : firstAvailable });
              }
              return;
            }
          }
          this.handlePlayFromHand(handItem, target);
          return;
        }
        this.handleMoveBoardCard(item as BoardCardItem, target);
      }
    });

    const dropState = dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver({ shallow: true }),
    }));

    highlight$ = dropState.pipe(map(state => state.canDrop && state.isOver));

    return [dropTarget, highlight$];
  }

  private handlePlayFromHand(item: HandItem, target: CardTarget): void {
    this.gameService.playCardAction(this.gameState.gameId, item.index, target);
  }

  private handleMoveBoardCard(item: BoardCardItem, target: CardTarget): void {
    const gameId = this.gameState.gameId;

    // // ReorderBenchAction
    // if (item.player === PlayerType.BOTTOM_PLAYER
    //   && item.slot === SlotType.BENCH
    //   && target.player === PlayerType.BOTTOM_PLAYER
    //   && target.slot === SlotType.BENCH
    //   && target.index !== item.index) {
    //   this.gameService.reorderBenchAction(gameId, item.index, target.index);
    //   return;
    // }

    // RetreatAction (Active -> Bench)
    if (item.player === PlayerType.BOTTOM_PLAYER
      && item.slot === SlotType.ACTIVE
      && target.player === PlayerType.BOTTOM_PLAYER
      && target.slot === SlotType.BENCH) {
      this.gameService.retreatAction(gameId, target.index);
      return;
    }

    // RetreatAction (Bench -> Active)
    if (item.player === PlayerType.BOTTOM_PLAYER
      && item.slot === SlotType.BENCH
      && target.player === PlayerType.BOTTOM_PLAYER
      && target.slot === SlotType.ACTIVE) {
      this.gameService.retreatAction(gameId, item.index);
      return;
    }
  }

  updateActivePlayer(newActivePlayer: Player) {
    this.activePlayer = newActivePlayer;
  }

  ngOnInit(): void {
    // Ensure board selection is cleared when board initializes
    this.boardInteractionService.endBoardSelection();

    // Your existing initialization code
    this.isUpsideDown = this.topPlayer?.id === this.clientId;
  }


  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.settingsSubscription.unsubscribe();
    this.boardTarget.unsubscribe();
    this.benchTarget.unsubscribe();
    this.bottomActive.source.unsubscribe();
    this.bottomActiveTarget.unsubscribe();

    for (let i = 0; i < MAX_BENCH_SIZE; i++) {
      this.bottomBench[i].source.unsubscribe();
      this.bottomBenchTarget[i].unsubscribe();
    }
  }

  public hasActivePrompt(): boolean {
    if (!this.gameState || !this.gameState.state) {
      return false;
    }
    return this.gameState.state.prompts.some(p => p.result === undefined);
  }

  private getScanUrl(item: BoardCardItem): string {
    const player = item.player === PlayerType.TOP_PLAYER
      ? this.topPlayer
      : this.bottomPlayer;

    if (!player) {
      return undefined;
    }
    const cardList = item.slot === SlotType.ACTIVE
      ? player.active
      : player.bench[item.index];

    const pokemonCard = cardList.getPokemonCard();
    // If the server has provided an artworks map on cardList, prefer that image
    const artworksMap = (cardList as any).artworksMap as { [code: string]: { imageUrl: string } } | undefined;
    if (pokemonCard && artworksMap && artworksMap[pokemonCard.fullName]?.imageUrl) {
      return artworksMap[pokemonCard.fullName].imageUrl;
    }
    return pokemonCard ? this.cardsBaseService.getScanUrl(pokemonCard) : undefined;
  }

  private createBoardCardItem(player: PlayerType, slot: SlotType, index: number = 0): BoardCardItem {
    const boardCardItem: BoardCardItem = { player, slot, index, scanUrl: undefined };

    const source = this.dnd.dragSource<BoardCardItem>(BoardCardType, {
      canDrag: () => {
        const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
        const isTopOwner = this.topPlayer && this.topPlayer.id === this.clientId;
        const isOwner = isBottomOwner || isTopOwner;
        const isDeleted = this.gameState.deleted;
        const isMinimized = this.gameState.promptMinimized;
        return !isDeleted && isOwner && !isMinimized && this.getScanUrl(boardCardItem) !== undefined;
      },
      beginDrag: () => {
        return { ...boardCardItem, scanUrl: this.getScanUrl(boardCardItem) };
      }
    });

    boardCardItem.source = source;

    return boardCardItem;
  }

  /**
   * Handle card click during normal gameplay or selection mode
   */
  public onCardClick(card: Card, cardList: CardList) {
    // Get the current selection mode state
    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe(); // Immediately unsubscribe to avoid memory leaks

    // Check if we're in selection mode
    if (isSelectionMode) {
      // Handle board selection if in selection mode
      this.handleSelectionModeCardClick(card, cardList);
    } else {
      // Normal card click behavior
      this.cardsBaseService.showCardInfo({ card, cardList });
    }
  }

  /**
   * Handle card click during selection mode
   */
  private handleSelectionModeCardClick(card: Card, cardList: CardList) {
    // First, determine the target for the clicked card
    let player: PlayerType;
    let slot: SlotType;
    let index: number = 0;

    // Check if card is in top player's cards
    if (this.topPlayer && (
      (this.topPlayer.active === cardList) ||
      this.topPlayer.bench.includes(cardList as PokemonCardList) ||
      this.topPlayer.stadium === cardList
    )) {
      player = PlayerType.TOP_PLAYER;

      if (this.topPlayer.active === cardList) {
        slot = SlotType.ACTIVE;
      } else if (this.topPlayer.stadium === cardList) {
        slot = SlotType.BOARD;
      } else {
        slot = SlotType.BENCH;
        index = this.topPlayer.bench.indexOf(cardList as PokemonCardList);
      }
    }
    // Check if card is in bottom player's cards
    else if (this.bottomPlayer && (
      (this.bottomPlayer.active === cardList) ||
      this.bottomPlayer.bench.includes(cardList as PokemonCardList) ||
      this.bottomPlayer.stadium === cardList
    )) {
      player = PlayerType.BOTTOM_PLAYER;

      if (this.bottomPlayer.active === cardList) {
        slot = SlotType.ACTIVE;
      } else if (this.bottomPlayer.stadium === cardList) {
        slot = SlotType.BOARD;
      } else {
        slot = SlotType.BENCH;
        index = this.bottomPlayer.bench.indexOf(cardList as PokemonCardList);
      }
    } else {
      // Not a valid target for selection
      return;
    }

    const target: CardTarget = { player, slot, index };

    // Check if this target is eligible for selection
    if (this.boardInteractionService.isTargetEligible(target)) {
      this.boardInteractionService.toggleTarget(target);
    }
  }

  public onCardListClick(card: Card, cardList: CardList) {
    this.cardsBaseService.showCardInfoList({ card, cardList });
  }

  public onPrizeClick(player: Player, prize: CardList) {
    if (player?.id !== this.clientId) { return; }
    const owner = player.id === this.clientId;
    if (prize.cards.length === 0) {
      return;
    }
    const card = prize.cards[0];
    const facedown = prize.isSecret || (!prize.isPublic && !owner);
    this.cardsBaseService.showCardInfo({ card, facedown });
  }

  public onDeckClick(card: Card, cardList: CardList) {
    const owner = [this.topPlayer, this.bottomPlayer].find(player => player?.id === this.clientId);
    if (cardList !== owner?.deck || this.isZoneEmpty(cardList)) {
      return;
    }
    const facedown = false;
    this.cardsBaseService.showCardInfoList({ card, cardList, facedown });
  }

  public onDiscardClick(card: Card, cardList: CardList) {
    if (this.isZoneEmpty(cardList)) {
      return;
    }

    const isBottomOwner = this.bottomPlayer?.id === this.clientId && cardList === this.bottomPlayer.discard;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardListClick(card, cardList);
    }

    const player = PlayerType.BOTTOM_PLAYER;
    const slot = SlotType.DISCARD;

    const options = { enableAbility: { useFromDiscard: true }, enableAttack: false };
    this.cardsBaseService.showCardInfoList({ card, cardList, options })
      .then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;

        const index = cardList.cards.indexOf(result.card);
        const target: CardTarget = { player, slot, index };

        // Use ability from the card
        if (result.ability) {
          if (result.card.superType === SuperType.TRAINER) {
            this.gameService.trainerAbility(gameId, result.ability, target);
          } else if (result.card.superType === SuperType.ENERGY) {
            this.gameService.energyAbility(gameId, result.ability, target);
          } else {
            this.gameService.ability(gameId, result.ability, target);
          }
        }
      });
  }

  public onActiveClick(card: Card, cardList: CardList) {
    // Get the current selection mode state
    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe();

    // If in selection mode, handle it through the onCardClick method
    if (isSelectionMode) {
      this.onCardClick(card, cardList);
      return;
    }

    // Normal processing continues below
    const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardClick(card, cardList);
    }

    const player = PlayerType.BOTTOM_PLAYER;
    const slot = SlotType.ACTIVE;
    const target: CardTarget = { player, slot, index: 0 };

    const options = { enableAbility: { useWhenInPlay: true }, enableAttack: true };
    this.cardsBaseService.showCardInfo({ card, cardList, options })
      .then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;

        // Use ability from the card
        if (result.ability) {
          this.gameService.ability(gameId, result.ability, target);

          // Use attack from the card
        } else if (result.attack) {
          this.gameService.attack(gameId, result.attack);
        }
      });
  }

  public onBenchClick(card: Card, cardList: CardList, index: number) {
    // Get the current selection mode state
    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe();

    // If in selection mode, handle it through the onCardClick method
    if (isSelectionMode) {
      this.onCardClick(card, cardList);
      return;
    }

    // Normal processing continues below
    const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardClick(card, cardList);
    }

    const player = PlayerType.BOTTOM_PLAYER;
    const slot = SlotType.BENCH;
    const target: CardTarget = { player, slot, index };
    const hasUseOnBenchAttack = card.attacks?.some(attack => attack.useOnBench);
    const isOnBench = cardList !== this.gameState.state.players[this.gameState.state.activePlayer].active;

    const options = {
      enableAbility: { useWhenInPlay: true },
      enableAttack: !isOnBench || hasUseOnBenchAttack,
      enableBenchAttack: hasUseOnBenchAttack
    };

    this.cardsBaseService.showCardInfo({ card, cardList, options })
      .then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;

        if (result.ability) {
          this.gameService.ability(gameId, result.ability, target);
        } else if (result.attack) {
          const attack = card.attacks.find(a => a.name === result.attack);
          if (attack && (attack.useOnBench || !isOnBench)) {
            this.gameService.attack(gameId, result.attack);
          }
        }
      });
  }

  get stadiumHalves(): Card[] {
    return (this.stadiumCard?.cards || []).slice().sort((a, b) => Number(a.setNumber) - Number(b.setNumber));
  }

  public stadiumArtwork(card: Card): string | undefined {
    const artworkMap = (this.stadiumCard as any)?.artworksMap;
    return artworkMap?.[card.fullName]?.imageUrl;
  }

  public onStadiumClick(card: Card) {
    const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardClick(card, this.stadiumCard);
    }

    const options = { enableTrainer: true };
    this.cardsBaseService.showCardInfo({ card, cardList: this.stadiumCard, options })
      .then(result => {
        if (!result) {
          return;
        }

        // Use stadium card effect
        if (result.trainer) {
          this.gameService.stadium(this.gameState.gameId);
        }
      });
  }

  public onHandCardClick(card: Card, cardList: CardList, index: number) {
    const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      return this.onCardClick(card, cardList);
    }
    const player = PlayerType.BOTTOM_PLAYER;
    const slot = SlotType.HAND;
    const target: CardTarget = { player, slot, index };

    const options = { enableAbility: { useFromHand: true }, enableAttack: false };
    this.cardsBaseService.showCardInfo({ card, cardList, options })
      .then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;

        if (result.ability) {
          this.gameService.ability(gameId, result.ability, target);
        }
      });
  }

  public onLostZoneClick(card: Card, cardList: CardList) {
    if (this.isZoneEmpty(cardList)) {
      return;
    }

    return this.onCardListClick(card, cardList);
  }

  /**
   * Get the count of remaining prizes for a player
   */
  public getPrizeCount(player: Player): number {
    if (!player || !player.prizes) {
      return 0;
    }
    return player.prizes.filter(prize => prize.cards.length > 0).length;
  }

  /**
   * Check if a zone is empty
   */
  public isZoneEmpty(cardList: CardList | undefined): boolean {
    return !cardList || !cardList.cards || cardList.cards.length === 0;
  }

  /**
   * Check if deck is empty
   */
  public isDeckEmpty(player: Player | undefined): boolean {
    return this.isZoneEmpty(player?.deck);
  }

  /**
   * Check if discard is empty
   */
  public isDiscardEmpty(player: Player | undefined): boolean {
    return this.isZoneEmpty(player?.discard);
  }

  /**
   * Check if lost zone is empty
   */
  public isLostZoneEmpty(player: Player | undefined): boolean {
    return this.isZoneEmpty(player?.lostzone);
  }

  /**
   * Check if prizes are empty
   */
  public isPrizesEmpty(player: Player | undefined): boolean {
    return this.getPrizeCount(player) === 0;
  }

  /**
   * Handle clicking on prizes zone in mobile compact view
   */
  /**
   * Handle clicking on the hand zone item to toggle hand visibility
   */
  public onHandToggleClick(): void {
    this.toggleHand.emit();
  }

  public onPrizesModalClick(player: Player) {
    if (player?.id !== this.clientId || !player?.prizes || player.prizes.length === 0 || this.isPrizesEmpty(player)) {
      return;
    }

    const isBottomOwner = player.id === this.clientId;
    const isDeleted = this.gameState.deleted;

    if (!isBottomOwner || isDeleted) {
      // For opponent's prizes, show the first card
      const firstPrize = player.prizes.find(prize => prize.cards.length > 0);
      if (firstPrize) {
        this.onPrizeClick(player, firstPrize);
      }
      return;
    }

    // For your own prizes, create a combined card list and show menu
    const allPrizeCards: Card[] = [];
    player.prizes.forEach(prize => {
      allPrizeCards.push(...prize.cards);
    });

    if (allPrizeCards.length === 0) {
      return;
    }

    const card = allPrizeCards[0];
    const prizeCardList: CardList = {
      cards: allPrizeCards,
      isPublic: false,
      isSecret: false
    } as CardList;

    this.cardsBaseService.showCardInfoList({ card, cardList: prizeCardList });
  }
}
