import { Component, HostBinding, Input, OnChanges } from '@angular/core';
import { Player, Card, CardList, CardTarget, GamePhase, PlayerType, SlotType } from 'ptcg-server';
import { SortableSpec } from '@ng-dnd/sortable';

import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { HandItem, HandCardType } from './hand-item.interface';
import { LocalGameState } from '../../shared/session/session.interface';
import { GameService } from '../../api/services/game.service';
import { buildHandStacks, HandStack } from './hand-layout';

@Component({
  selector: 'ptcg-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],

})
export class HandComponent implements OnChanges {

  public readonly handListId = 'HAND_LIST';

  @Input() player: Player;
  @Input() gameState: LocalGameState;
  @Input() clientId: number;
  @Input() isOpponent: boolean = false;

  public cards: Card[] = [];
  public isFaceDown: boolean;
  public isDeleted: boolean;
  public handSpec: SortableSpec<HandItem>;
  public list: HandItem[] = [];
  public stacks: HandStack[] = [];
  private isOwner: boolean;
  private dragging = false;
  private suppressClickUntil = 0;
  private touchStart?: { x: number; y: number };
  private touchMode?: 'scroll' | 'drag';

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) {
    this.handSpec = {
      type: HandCardType,
      trackBy: item => (item as HandStack).key || item.index,
      // The hand is automatically sorted. Dragging is only for playing cards.
      hover: () => {},
      drop: () => {},
      canDrop: () => false,
      canDrag: () => {
        const isMinimized = this.gameState && this.gameState.promptMinimized;
        return this.isOwner && !this.isFaceDown && !this.isDeleted && !isMinimized
          && !this.gameState?.turnComplete;
      },
      beginDrag: () => { this.dragging = true; },
      endDrag: () => {
        this.dragging = false;
        this.suppressClickUntil = Date.now() + 350;
      }
    };
  }

  @HostBinding('class.opponent') get opponent(): boolean { return this.isOpponent; }

  ngOnChanges() {
    if (this.gameState) {
      this.isDeleted = this.gameState.deleted;
    }

    if (this.player) {
      const hand = this.player.hand;
      this.isOwner = this.player.id === this.clientId;
      this.cards = hand.cards;
      this.list = this.buildHandList(hand);
      this.isFaceDown = hand.isSecret || (!hand.isPublic && !this.isOwner);
      const state = this.gameState?.state;
      const canPlay = this.isOwner && !this.isDeleted && !this.isFaceDown
        && !this.gameState?.turnComplete && !this.gameState?.promptMinimized
        && state?.phase === GamePhase.PLAYER_TURN
        && state.players[state.activePlayer]?.id === this.clientId
        && !state.prompts.some(prompt => prompt.result === undefined);
      this.stacks = buildHandStacks(this.list, canPlay ? this.player.playableCardIds || [] : [], this.isFaceDown);
    } else {
      this.cards = [];
      this.list = [];
      this.stacks = [];
      this.isOwner = false;
      this.isFaceDown = true;
    }
  }

  public showCardInfo(card: Card) {
    const facedown = this.isFaceDown;
    this.cardsBaseService.showCardInfo({ card, facedown, cardList: this.player?.hand });
  }

  public onCardClick(card: Card, index: number) {
    if (this.dragging || Date.now() < this.suppressClickUntil) { return; }
    if (!this.isOwner || this.isDeleted) {
      return this.showCardInfo(card);
    }

    const gameId = this.gameState.gameId;
    const options = { enableAbility: { useFromHand: true }, enableAttack: false };
    this.cardsBaseService.showCardInfo({ card, options, facedown: this.isFaceDown, cardList: this.player.hand })
      .then(result => {
        if (!result || this.gameState.gameId !== gameId) {
          return;
        }
        if (result.ability) {
          const selected = result.card || card;
          const currentIndex = this.player.hand.cards.findIndex(item => item.id === selected.id);
          if (currentIndex === -1) { return; }
          const target: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: currentIndex };
          this.gameService.ability(gameId, result.ability, target);
        }
      });
  }

  public onTouchStart(event: TouchEvent): void {
    const touch = event.touches.length === 1 ? event.touches[0] : undefined;
    this.touchStart = touch && { x: touch.clientX, y: touch.clientY };
    this.touchMode = undefined;
  }

  public onTouchMove(event: TouchEvent): void {
    if (!this.touchStart || event.touches.length !== 1 || this.dragging) { return; }
    const dx = Math.abs(event.touches[0].clientX - this.touchStart.x);
    const dy = Math.abs(event.touches[0].clientY - this.touchStart.y);
    if (!this.touchMode && Math.max(dx, dy) >= 8) {
      this.touchMode = dx > dy ? 'scroll' : 'drag';
    }
    if (this.touchMode) { this.suppressClickUntil = Date.now() + 350; }
    // Leave horizontal gestures to native scrolling, before they reach the
    // document's touch drag backend. Vertical drags still reach board targets.
    if (this.touchMode !== 'drag') { event.stopPropagation(); }
  }

  public onTouchEnd(): void {
    if (this.touchMode) { this.suppressClickUntil = Date.now() + 350; }
    this.touchStart = undefined;
    this.touchMode = undefined;
  }

  public onWheel(event: WheelEvent): void {
    const viewport = event.currentTarget as HTMLElement;
    if (viewport.scrollWidth <= viewport.clientWidth || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) { return; }
    const distance = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1);
    viewport.scrollLeft += distance;
    event.preventDefault();
  }

  public cardLabel(stack: HandStack): string {
    if (this.isFaceDown) { return 'Face-down card'; }
    return `${stack.card.name}${stack.copies.length > 1 ? `, ${stack.copies.length} copies` : ''}${stack.playable ? ', playable' : ''}`;
  }

  private buildHandList(cards: CardList): HandItem[] {
    return cards.cards.map((card, index) => {
      const item: HandItem = {
        card,
        index,
        scanUrl: this.cardsBaseService.getScanUrl(card)
      };
      return item;
    });
  }

}
