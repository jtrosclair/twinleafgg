import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { flipForStatusAfterDamage } from './status-after-damage';

export class Chikorita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sleep Scent',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
  },
{
    name: 'Jump On',
    cost: [G],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Chikorita';
  public fullName: string = 'Chikorita MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/hoothoot.ts (coin-gated Special Condition).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      flipForStatusAfterDamage(state, effect, SpecialCondition.ASLEEP);
    }

    // Ref: set-diamond-and-pearl/starly.ts (coin-gated damage bonus).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }
}
