import { CoinFlipPrompt, GameMessage, State, StoreLike } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Wave Swallower',
      cost: [W, W, W],
      damage: 50,
      text: 'Flip a coin until you get tails. For each heads, heal 50 damage from this Pokémon.'
    }
  ];

  public set: string = 'CES';
  public setNumber: string = '39';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wailmer';
  public fullName: string = 'Wailmer CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const flipCoin = (healAmount: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(healAmount + 50);
          }
          if (healAmount > 0) {
            const healEffect = new HealEffect(player, player.active, healAmount);
            store.reduceEffect(state, healEffect);
          }
          return state;
        });
      };
      return flipCoin();
    }

    return state;
  }
}