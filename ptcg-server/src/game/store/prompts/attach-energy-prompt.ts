import { Card } from '../card/card';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { CardList } from '../state/card-list';
import { FilterType } from './choose-cards-prompt';
import { SuperType, CardType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';

export const AttachEnergyPromptType = 'Attach energy';

export interface AttachEnergyOptions {
  allowCancel: boolean;
  min: number;
  max: number;
  blocked: number[];
  blockedTo: CardTarget[];
  differentTypes: boolean;
  sameTarget: boolean;
  differentTargets: boolean;
  validCardTypes?: CardType[];
  maxPerType?: number;
  maxPerTarget?: { target: CardTarget; max: number }[];
}

export type AttachEnergyResultType = { to: CardTarget, index: number }[];

export interface CardAssign {
  to: CardTarget;
  card: Card;
}

export class AttachEnergyPrompt extends Prompt<CardAssign[]> {

  readonly type: string = AttachEnergyPromptType;

  public options: AttachEnergyOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cardList: CardList,
    public playerType: PlayerType,
    public slots: SlotType[],
    public filter: FilterType,
    options?: Partial<AttachEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: cardList.cards.length,
      blocked: [],
      blockedTo: [],
      differentTypes: false,
      sameTarget: false,
      differentTargets: false
    }, options);
  }

  public decode(result: AttachEnergyResultType | null, state: State): CardAssign[] | null {
    if (result === null) {
      return null;
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const targets: CardTarget[] = [];
    for (const owner of state.players) {
      const side = owner === player ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER;
      if (this.playerType === PlayerType.ANY || this.playerType === side) {
        owner.forEachPokemon(side, (_list, _card, target) => {
          if (this.slots.includes(target.slot)) targets.push(target);
        });
      }
    }
    const transfers: CardAssign[] = [];
    result.forEach(t => {
      const cardList = this.cardList;
      const card = cardList.cards[t.index];
      // Verify this is a card.
      if (!(card instanceof Card)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      // Verify card is an energy card
      if (card.superType !== SuperType.ENERGY) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      // Verify card is not blocked
      if (this.options.blocked.includes(t.index)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      if (!targets.some(target => target.player === t.to?.player
        && target.slot === t.to.slot && target.index === t.to.index)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      transfers.push({ to: t.to, card });
    });
    return transfers;
  }

  public validate(result: CardAssign[] | null): boolean {
    return result === null ? this.options.allowCancel
      : result.length >= this.options.min && this.validateAssignments(result);
  }

  public isEligibleCard(card: Card, index = this.cardList.cards.indexOf(card)): boolean {
    if (!(card instanceof EnergyCard) || index < 0 || this.options.blocked.includes(index)) return false;

    const { cardType, provides, ...filter } = this.filter as Partial<EnergyCard> & { cardType?: CardType };
    if (cardType !== undefined && !card.provides.includes(cardType)) return false;
    if (provides && (provides.length !== card.provides.length
      || provides.some((type, i) => type !== card.provides[i]))) return false;
    const allowedTypes = this.options.validCardTypes;
    if (allowedTypes && !card.provides.some(type => allowedTypes.includes(type))) return false;

    return Object.entries(filter).every(([key, value]) => card[key as keyof EnergyCard] === value);
  }

  /** Check the rules that apply before the player has selected the minimum. */
  public validateAssignments(result: CardAssign[]): boolean {
    if (result.length > this.options.max || new Set(result.map(r => r.card)).size !== result.length
      || result.some(r => !this.isEligibleCard(r.card))) {
      return false;
    }
    if (result.some(r => this.options.blockedTo.some(target =>
      target.player === r.to.player && target.slot === r.to.slot && target.index === r.to.index))) {
      return false;
    }

    if (this.options.maxPerTarget?.some(({ target, max }) => {
      const assigned = result.filter(({ to }) =>
        to.player === target.player && to.slot === target.slot && to.index === target.index);
      return assigned.length > max;
    })) {
      return false;
    }

    if (this.options.maxPerType) {
      const typeCounts = new Map<CardType, number>();
      for (const assign of result) {
        const energyCard = assign.card as EnergyCard;
        const type = energyCard.provides[0];
        typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
        if (typeCounts.get(type)! > this.options.maxPerType) {
          return false;
        }
      }
    }

    // Check if all targets are the same
    if (this.options.sameTarget && result.length > 1) {
      const t = result[0].to;
      const different = result.some(r => {
        return r.to.player !== t.player
          || r.to.slot !== t.slot
          || r.to.index !== t.index;
      });
      if (different) {
        return false;
      }
    }

    // Check if 'different types' restriction is valid
    if (this.options.differentTypes) {
      const types = new Set(result.map(({ card }) => (card as EnergyCard).provides[0] ?? CardType.NONE));
      if (types.size !== result.length) return false;
    }

    // Check if all selected targets are different
    if (this.options.differentTargets && result.length > 1) {
      for (let i = 0; i < result.length; i++) {
        const t = result[i].to;
        const index = result.findIndex(r => {
          return r.to.player === t.player
            && r.to.slot === t.slot
            && r.to.index === t.index;
        });
        if (index !== i) {
          return false;
        }
      }
    }

    return true;
  }

}
