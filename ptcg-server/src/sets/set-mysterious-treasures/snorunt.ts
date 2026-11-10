import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Snorunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = W;
  public weakness = [{ type: M, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Collect',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
{
    name: 'Snowball',
    cost: [W],
    damage: 20,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Snorunt';
  public fullName: string = 'Snorunt MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-dragons-majesty/swablu.ts (Collect).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      afterAttackDamage(state, effect, (_store, resultState) => { DRAW_CARDS(player, 1); return resultState; });
    }

    // Ref: set-diamond-and-pearl/hoothoot.ts (coin-gated attack).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
