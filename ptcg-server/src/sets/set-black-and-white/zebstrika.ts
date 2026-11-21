import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zebstrika extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Blitzle';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Rear Kick',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Electrispark',
    cost: [L, L, L],
    damage: 70,
    text: 'Does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Zebstrika';
  public fullName: string = 'Zebstrika BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamage(state, effect, (attackStore, attackState) => {
        const bench = effect.opponent.bench.filter(slot => slot.getPokemonCard());
        DAMAGE_OPPONENT_POKEMON(attackStore, attackState, effect, 10, bench);
        return attackState;
      });
    }

    return state;
  }
}
