import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DndService, DragSource, DropTarget } from '@ng-dnd/core';
import { Observable } from 'rxjs';
import { AnimationEvent } from '@angular/animations';
import { Card, ChooseCardsPrompt, SuperType } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { handCardKey } from '../../hand/hand-layout';
import { PromptCardItem, PromptCardStack, SelectorCardType, SelectorDraggedCard } from './prompt-choose-cards.interface';
import { ptcgPromptAnimations } from '../prompt.animations';
import { CardSlotRule, cardSlotRules, partialSelectionPrompt } from './card-slot-rules';

@Component({
  selector: 'ptcg-prompt-choose-cards',
  templateUrl: './prompt-choose-cards.component.html',
  styleUrls: ['./prompt-choose-cards.component.scss'],
  animations: [ptcgPromptAnimations.selectorVisibility]
})
export class PromptChooseCardsComponent implements OnChanges, OnDestroy {
  @Input() prompt: ChooseCardsPrompt;
  @Input() gameState: LocalGameState;
  @Input() minimized = false;
  public boardView = false;
  public fadeDuration = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ? 0 : 100;

  public currentTab = 'Valid';
  public promptItems: PromptCardItem[] = [];
  public cardStacks: PromptCardStack[] = [];
  public selectedCards: PromptCardItem[] = [];
  public slotCards: PromptCardItem[] = [];
  public slots: number[] = [];
  public slotRules: CardSlotRule[] = [];
  public isInvalid = true;
  public slotTargets: Array<DropTarget<SelectorDraggedCard>> = [];
  public slotSources: Array<DragSource<SelectorDraggedCard>> = [];
  public slotOver: Array<Observable<boolean>> = [];
  public trayTarget: DropTarget<SelectorDraggedCard>;
  public rowTarget: DropTarget<SelectorDraggedCard>;
  public trayOver: Observable<boolean>;
  public rowOver: Observable<boolean>;
  public draggingIndex: number | undefined;

  private allItems: PromptCardItem[] = [];
  private partialPrompt: ChooseCardsPrompt;
  private stackSources = new Map<string, DragSource<SelectorDraggedCard>>();
  private result: number[] = [];
  private suppressClickUntil = 0;
  private touchStart?: { x: number; y: number };
  private touchMode?: 'scroll' | 'drag';
  private touchScrollable = true;

  constructor(
    private gameService: GameService,
    private cardsBaseService: CardsBaseService,
    private dnd: DndService
  ) {
    this.trayTarget = this.createTarget(true);
    this.rowTarget = this.createTarget(false);
    this.trayOver = this.trayTarget.listen(monitor => monitor.isOver({ shallow: true }) && monitor.canDrop());
    this.rowOver = this.rowTarget.listen(monitor => monitor.isOver() && monitor.canDrop());
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Keep the layout mounted until fade-out finishes; restore it before fade-in.
    if (!this.minimized) { this.boardView = false; }
    if (changes.prompt && this.prompt) {
      this.releaseCardConnections();
      this.currentTab = 'Valid';
      this.selectedCards = [];
      this.slotCards = Array(this.isSetupGame ? 6 : this.maxCards).fill(undefined);
      this.partialPrompt = partialSelectionPrompt(this.prompt);
      this.slotRules = cardSlotRules(this.prompt, this.slotCards.length);
      this.result = [];
      const blocked = this.prompt.options.blocked || [];
      this.allItems = this.prompt.cards.cards.map((card, index) => ({
        card, index, originalIndex: index,
        isAvailable: !blocked.includes(index) && Object.keys(this.prompt.filter || {})
          .every(key => (this.prompt.filter as any)[key] === (card as any)[key]),
        isSecret: this.prompt.options.isSecret,
        scanUrl: ''
      }));
      this.slots = Array.from({ length: this.isSetupGame ? 6 : this.maxCards }, (_, index) => index);
      this.slotSources = this.slots.map(slot => this.createSource(() => this.slotCards[slot]));
      this.slotTargets = this.slots.map(slot => this.createTarget(true, slot));
      this.slotOver = this.slotTargets.map(target => target.listen(monitor => monitor.isOver() && monitor.canDrop()));
      this.updateFilteredItems();
    }
    if (this.prompt) { this.updateValidity(); }
  }

  public onVisibilityDone(event: AnimationEvent): void {
    if (event.toState === 'hidden' && this.minimized) { this.boardView = true; }
  }

  ngOnDestroy(): void {
    this.releaseCardConnections();
    this.trayTarget.unsubscribe();
    this.rowTarget.unsubscribe();
  }

  private releaseCardConnections(): void {
    this.slotSources.forEach(source => source.unsubscribe());
    this.stackSources.forEach(source => source.unsubscribe());
    this.stackSources.clear();
    this.slotTargets.forEach(target => target.unsubscribe());
    this.draggingIndex = undefined;
  }

  private createSource(getItem: () => PromptCardItem | undefined): DragSource<SelectorDraggedCard> {
    return this.dnd.dragSource<SelectorDraggedCard>(SelectorCardType, {
      canDrag: () => {
        const item = getItem();
        return !!item && !this.minimized && !this.gameState.deleted
          && (this.selectedCards.includes(item) || this.canSelect(item));
      },
      beginDrag: () => {
        const item = getItem();
        this.draggingIndex = item.index;
        return { data: item, promptId: this.prompt.id, localId: this.gameState.localId,
          selected: this.selectedCards.includes(item) };
      },
      endDrag: () => {
        this.draggingIndex = undefined;
        this.suppressClickUntil = Date.now() + 350;
      }
    });
  }

  private createTarget(selecting: boolean, slot?: number): DropTarget<SelectorDraggedCard> {
    return this.dnd.dropTarget<SelectorDraggedCard>(SelectorCardType, {
      canDrop: monitor => this.canDropCard(monitor.getItem(), selecting, slot),
      drop: monitor => {
        // An incompatible slot must not bubble into the tray and fill another slot.
        if (!monitor.didDrop() && (!selecting || slot !== undefined || monitor.isOver({ shallow: true }))) {
          this.dropCard(monitor.getItem(), selecting, slot);
        }
      }
    });
  }

  public canDropCard(drag: SelectorDraggedCard, selecting: boolean, slot?: number): boolean {
    if (!drag?.data || this.minimized || this.gameState.deleted || drag.promptId !== this.prompt.id
      || drag.localId !== this.gameState.localId || this.allItems[drag.data.index] !== drag.data
      || drag.selected !== this.selectedCards.includes(drag.data)) { return false; }
    if (!selecting) { return drag.selected; }
    if (slot !== undefined && !this.slots.includes(slot)) { return false; }
    if (drag.selected) {
      if (slot === undefined || this.slotCards[slot] === drag.data || !this.slotRules[slot].accepts(drag.data.card)) {
        return false;
      }
      const previous = this.slotCards.indexOf(drag.data);
      const displaced = this.slotCards[slot];
      return !displaced || this.slotRules[previous].accepts(displaced.card);
    }
    return this.canSelect(drag.data) && (slot === undefined
      || (!this.slotCards[slot] && this.slotRules[slot].accepts(drag.data.card)));
  }

  public dropCard(drag: SelectorDraggedCard, selecting: boolean, slot?: number): void {
    if (!this.canDropCard(drag, selecting, slot)) { return; }
    if (!selecting) { this.removeCard(drag.data); }
    else if (!drag.selected) { this.selectCard(drag.data, slot); }
    else {
      const previous = this.slotCards.indexOf(drag.data);
      this.slotCards[previous] = this.slotCards[slot];
      this.slotCards[slot] = drag.data;
      this.syncSelection();
    }
  }

  get maxCards(): number { return this.prompt.options.max; }
  get isSetupGame(): boolean { return this.prompt.message === 'CHOOSE_STARTING_POKEMONS'; }
  get isDiscard(): boolean {
    return ['CHOOSE_CARD_TO_DISCARD', 'CHOOSE_POKEMON_TO_DISCARD', 'CHOOSE_ENERGY_TO_DISCARD']
      .includes(this.prompt.message);
  }
  get showTabs(): boolean { return !this.isDiscard && !this.prompt.options.isSecret && !this.isSetupGame; }

  get sourceCard(): Card | undefined {
    const player = this.gameState?.state.players.find(item => item.id === this.prompt.playerId);
    const cards = player?.supporter.cards || [];
    return cards[cards.length - 1];
  }

  get instructionKey(): string {
    if (this.prompt.message === 'CHOOSE_CARD_TO_DISCARD') { return 'PROMPT_DISCARD_INSTRUCTION'; }
    if (this.prompt.message === 'CHOOSE_CARD_TO_HAND') { return 'PROMPT_HAND_INSTRUCTION'; }
    return 'GAME_MESSAGES.' + this.prompt.message;
  }

  get instructionParams(): { quantity: string; cardType: string } {
    const count = this.maxCards;
    const pokemon = this.prompt.filter?.superType === SuperType.POKEMON;
    const energy = this.prompt.filter?.superType === SuperType.ENERGY;
    return {
      quantity: this.prompt.options.min < count ? `up to ${count}` : String(count),
      cardType: pokemon ? 'Pokémon' : energy ? (count === 1 ? 'Energy card' : 'Energy cards')
        : (count === 1 ? 'card' : 'cards')
    };
  }

  public onTabChange(tab: string, viewport: HTMLElement): void {
    this.currentTab = tab;
    this.updateFilteredItems();
    viewport.scrollLeft = 0;
  }

  private updateFilteredItems(): void {
    const selected = new Set(this.selectedCards.map(item => item.index));
    this.promptItems = this.allItems.filter(item => !selected.has(item.index)
      && (this.currentTab === 'All' || item.isAvailable));
    const groups = new Map<string, PromptCardItem[]>();
    for (const item of this.promptItems) {
      // Secret cards retain their individual positions without revealing duplicates.
      const key = item.isSecret ? `hidden-${item.index}` : handCardKey(item.card);
      if (!groups.has(key)) { groups.set(key, []); }
      groups.get(key).push(item);
    }
    this.cardStacks = Array.from(groups, ([key, copies]) => {
      // A blocked print must never prevent selecting an eligible copy beneath it.
      const front = copies.find(item => item.isAvailable) || copies[0];
      // Keep each DOM node's connection stable when its representative copy changes.
      if (!this.stackSources.has(key)) {
        this.stackSources.set(key, this.createSource(() => this.cardStacks.find(stack => stack.key === key)?.front));
      }
      return { key, front, copies, source: this.stackSources.get(key),
        backingCards: copies.filter(item => item !== front).slice(0, 2).reverse() };
    });
  }

  public canSelect(item: PromptCardItem): boolean {
    return item.isAvailable && !this.minimized && !this.gameState.deleted && this.selectedCards.length < this.maxCards
      && !this.selectedCards.some(selected => selected.index === item.index)
      && this.emptySlotFor(item) !== -1
      && this.partialPrompt.validate([...this.selectedCards.map(selected => selected.card), item.card]);
  }

  private emptySlotFor(item: PromptCardItem): number {
    return this.slots.findIndex(slot => !this.slotCards[slot] && this.slotRules[slot].accepts(item.card));
  }

  public selectCard(item: PromptCardItem, slot = this.emptySlotFor(item)): void {
    if (!this.canSelect(item)) { return; }
    if (!this.slots.includes(slot) || this.slotCards[slot] || !this.slotRules[slot].accepts(item.card)) { return; }
    this.slotCards[slot] = item;
    this.syncSelection();
  }

  public removeCard(item: PromptCardItem): void {
    if (this.gameState.deleted) { return; }
    this.slotCards = this.slotCards.map(selected => selected?.index === item.index ? undefined : selected);
    this.syncSelection();
  }

  private syncSelection(): void {
    this.selectedCards = this.slotCards.filter(Boolean);
    this.updateFilteredItems();
    this.updateValidity();
  }

  private updateValidity(): void {
    this.result = this.selectedCards.map(item => item.index);
    this.isInvalid = (this.isSetupGame && !this.slotCards[0])
      || !this.prompt.validate(this.result.map(index => this.prompt.cards.cards[index]));
  }

  public toggleBoard(): void {
    this.gameService.setPromptMinimized(this.gameState.localId, !this.minimized);
  }

  public confirm(): void {
    this.updateValidity();
    if (this.minimized || this.gameState.deleted || this.isInvalid) { return; }
    this.gameService.resolvePrompt(this.gameState.gameId, this.prompt.id, this.result);
  }

  public cancel(): void {
    if (this.minimized || this.gameState.deleted || !this.prompt.options.allowCancel) { return; }
    this.gameService.resolvePrompt(this.gameState.gameId, this.prompt.id, null);
  }

  public cardName(item: PromptCardItem): string {
    return item.isSecret ? `Face-down card ${item.index + 1}` : item.card.name;
  }

  public stackLabel(stack: PromptCardStack): string {
    return `Inspect ${this.cardName(stack.front)}${stack.copies.length > 1 ? `, ${stack.copies.length} copies remaining` : ''}`;
  }

  public showCardInfo(item: PromptCardItem): void {
    if (this.minimized || this.draggingIndex !== undefined || Date.now() < this.suppressClickUntil) { return; }
    this.cardsBaseService.showCardInfo({ card: item.card, facedown: item.isSecret });
  }

  public onTouchStart(event: TouchEvent, scrollable = true): void {
    const touch = event.touches.length === 1 ? event.touches[0] : undefined;
    this.touchStart = touch && { x: touch.clientX, y: touch.clientY };
    this.touchScrollable = scrollable;
    this.touchMode = undefined;
  }

  public onTouchMove(event: TouchEvent): void {
    if (!this.touchStart || event.touches.length !== 1 || this.draggingIndex !== undefined) { return; }
    const dx = Math.abs(event.touches[0].clientX - this.touchStart.x);
    const dy = Math.abs(event.touches[0].clientY - this.touchStart.y);
    if (!this.touchMode && Math.max(dx, dy) >= 8) {
      this.touchMode = this.touchScrollable && dx > dy ? 'scroll' : 'drag';
    }
    if (Math.max(dx, dy) >= 8) { this.suppressClickUntil = Date.now() + 350; }
    if (this.touchMode !== 'drag') { event.stopPropagation(); }
  }

  public onTouchEnd(): void {
    if (this.touchStart && Date.now() < this.suppressClickUntil) { this.suppressClickUntil = Date.now() + 350; }
    this.touchStart = undefined;
    this.touchMode = undefined;
  }

  public onWheel(event: WheelEvent, viewport: HTMLElement): void {
    // Native horizontal gestures already scroll the row; map a mouse wheel to it too.
    if (Math.abs(event.deltaX) >= Math.abs(event.deltaY) || viewport.scrollWidth <= viewport.clientWidth) { return; }
    event.preventDefault();
    viewport.scrollLeft += event.deltaY;
  }

  public trackStack(_index: number, stack: PromptCardStack): string { return stack.key; }
}
