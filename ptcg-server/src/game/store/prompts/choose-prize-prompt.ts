import { CardList } from '../state/card-list';
import { Prompt } from './prompt';
import { State } from '../state/state';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';

export const ChoosePrizePromptType = 'Choose prize';

export interface ChoosePrizeOptions {
  isSecret: boolean;
  count: number;
  max: number;
  blocked: number[];
  useOpponentPrizes: boolean;
  allowCancel: boolean;
  destination?: CardList;
}

export class ChoosePrizePrompt extends Prompt<CardList[]> {

  readonly type: string = ChoosePrizePromptType;

  public options: ChoosePrizeOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    options?: Partial<ChoosePrizeOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      count: 1,
      max: 1,
      blocked: [],
      allowCancel: false,
      isSecret: false,
      useOpponentPrizes: false
    }, options);

    this.options.max = this.options.count;

  }

  public availablePrizes(state: State): CardList[] {
    const player = state.players.find(p => p.id === this.playerId);
    if (!player) return [];
    const owner = this.options.useOpponentPrizes ? state.players.find(p => p !== player) : player;
    return owner?.prizes.filter(prize => prize.cards.length > 0) ?? [];
  }

  public decode(result: number[] | null, state: State): CardList[] | null {
    if (result === null) return null;
    const prizes = this.availablePrizes(state);
    if (!Array.isArray(result) || result.some(index => !Number.isInteger(index) || !prizes[index])) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return result.map(index => prizes[index]);
  }

  public validate(result: CardList[] | null, state: State): boolean {
    if (result === null) return this.options.allowCancel;
    if (!Array.isArray(result) || result.length !== this.options.count
      || new Set(result).size !== result.length) return false;
    const prizes = this.availablePrizes(state);
    return result.every(prize => {
      const index = prizes.indexOf(prize);
      return index >= 0 && !this.options.blocked.includes(index);
    });
  }
}
