import { Card } from '../card/card';
import { SuperType } from '../card/card-types';
import { PokemonCardList } from '../state/pokemon-card-list';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { StateUtils } from '../state-utils';
import { FilterType } from './choose-cards-prompt';

export const MoveEnergyPromptType = 'Move energy';

export type MoveEnergyResultType = { from: CardTarget, to: CardTarget, index: number }[];

export interface CardTransfer {
  from: CardTarget;
  to: CardTarget;
  card: Card;
}

export interface MoveEnergyOptions {
  allowCancel: boolean;
  min: number;
  max: number | undefined;
  blockedFrom: CardTarget[];
  blockedTo: CardTarget[];
  blockedMap: { source: CardTarget, blocked: number[] }[];
  /** Enforce the offered Pokémon and attachment choices when resolving this move. */
  validateTransfers?: boolean;
}

export class MoveEnergyPrompt extends Prompt<CardTransfer[]> {

  readonly type: string = MoveEnergyPromptType;

  public options: MoveEnergyOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public playerType: PlayerType,
    public slots: SlotType[],
    public filter: FilterType,
    options?: Partial<MoveEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: undefined,
      blockedFrom: [],
      blockedTo: [],
      blockedMap: [],
    }, options);
  }

  public static sourceCards(slot: PokemonCardList): Card[] {
    return [...slot.cards, ...slot.energies.cards.filter(card => !slot.cards.includes(card))];
  }

  public static isAttachedEnergy(slot: PokemonCardList, card: Card): boolean {
    return slot.energies.cards.includes(card) || (slot.cards.includes(card) && card.superType === SuperType.ENERGY);
  }

  public decode(result: MoveEnergyResultType | null, state: State): CardTransfer[] | null {
    if (result === null) {
      return null;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers: CardTransfer[] = [];
    result.forEach(t => {
      const cardList = StateUtils.getTarget(state, player, t.from);
      const cards = this.options.validateTransfers ? MoveEnergyPrompt.sourceCards(cardList) : cardList.cards;
      const card = cards[t.index];
      // Verify this is a card.
      if (!(card instanceof Card)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      transfers.push({ from: t.from, to: t.to, card });
    });
    return transfers;
  }

  public validate(result: CardTransfer[] | null, state?: State): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (!this.options.validateTransfers) return result.every(transfer => transfer.card !== undefined);
    const player = state?.players.find(owner => owner.id === this.playerId);
    if (!state || !player || result.length < this.options.min || result.length > (this.options.max ?? Infinity)
      || new Set(result.map(transfer => transfer.card)).size !== result.length) return false;

    const opponent = StateUtils.getOpponent(state, player);
    const sameTarget = (left: CardTarget, right: CardTarget) =>
      left.player === right.player && left.slot === right.slot && left.index === right.index;
    const allowed = (target: CardTarget) =>
      (target.player === PlayerType.TOP_PLAYER || target.player === PlayerType.BOTTOM_PLAYER)
      && (target.player === this.playerType || this.playerType === PlayerType.ANY)
      && this.slots.includes(target.slot)
      && (target.slot === SlotType.ACTIVE ? target.index === 0
        : Number.isInteger(target.index) && target.index >= 0 && target.index < (target.player === PlayerType.TOP_PLAYER ? opponent : player).bench.length);

    return result.every(({ from, to, card }) => {
      if (!card || !allowed(from) || !allowed(to) || sameTarget(from, to)
        || this.options.blockedFrom.some(target => sameTarget(target, from))
        || this.options.blockedTo.some(target => sameTarget(target, to))) return false;
      const source = StateUtils.getTarget(state, player, from);
      const destination = StateUtils.getTarget(state, player, to);
      return !!source.getPokemonCard() && !!destination.getPokemonCard() && MoveEnergyPrompt.isAttachedEnergy(source, card)
        && !this.options.blockedMap.some(entry => sameTarget(entry.source, from)
          && entry.blocked.includes(MoveEnergyPrompt.sourceCards(source).indexOf(card)));
    });
  }

}
