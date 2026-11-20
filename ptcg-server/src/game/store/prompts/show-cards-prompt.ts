import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export interface ShowCardsOptions {
  allowCancel: boolean;
  sourcePlayerId?: number;
}

export class ShowCardsPrompt extends Prompt<true> {

  readonly type: string = 'Show cards';

  public options: ShowCardsOptions;

  /** The owner of the revealed cards. The prompt player is their viewer. */
  public sourcePlayerId?: number;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cards: Card[],
    options?: Partial<ShowCardsOptions>
  ) {
    super(playerId);

    if (options?.sourcePlayerId !== undefined) {
      this.sourcePlayerId = options.sourcePlayerId;
    }

    // Default options
    this.options = Object.assign({}, {
      allowCancel: false
    }, options);
  }
}
