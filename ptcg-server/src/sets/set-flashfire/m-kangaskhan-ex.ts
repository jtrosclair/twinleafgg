import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS } from '../../game/store/prefabs/attack-effects';

export class MKangaskhanEX extends PokemonCard {
  public stage: Stage = Stage.MEGA;
  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];
  public evolvesFrom = 'Kangaskhan-EX';
  public cardType: CardType = C;
  public hp: number = 230;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Wham Bam Punch',
    cost: [C, C, C],
    damage: 100,
    damageCalculation: '+',
    text: 'Flip a coin until you get tails. This attack does 30 more damage for each heads.'
  }];

  public set: string = 'FLF';
  public name: string = 'M Kangaskhan-EX';
  public fullName: string = 'M Kangaskhan-EX FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, 30);
    }

    return state;
  }

}
