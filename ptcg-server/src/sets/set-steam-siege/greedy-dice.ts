import { GameError } from '../../game';
import { GameMessage } from '../../game/game-message';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DrawPrizesEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { takeBonusPrize, takePrizeTo } from '../../game/store/prefabs/prize-reactions';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class GreedyDice extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'STS';

  public setNumber: string = '102';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Greedy Dice';

  public fullName: string = 'Greedy Dice STS';

  public text: string =
    'You can play this card only if you took it as a face-down Prize card, before you put it into your hand.' +
    `
    ` +
    'Flip a coin. If heads, take 1 more Prize card.';

  // Keep the default for existing snapshots. Eligibility follows the physical Prize.
  public cardUsed = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    // Ref: set-pokemon-151/chansey.ts (one resolved coin can award an extra Prize).
    if (effect instanceof DrawPrizesEffect) {
      const { player } = effect;
      effect.offer(this, GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES, () => true, prize => {
        takePrizeTo(player, prize, player.discard);
        const coinFlip = new CoinFlipEffect(player, heads => {
          if (heads) takeBonusPrize(store, state, effect);
        });
        coinFlip.skipAttackReflip = true;
        store.reduceEffect(state, coinFlip);
      });
    }
    return state;
  }
}
