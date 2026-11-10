import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Pangoro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pancham';
  public hp = 140;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];
  public attacks = [
    { name: 'Corkscrew Punch', cost: [D], damage: 40, text: '' },
    { name: 'Master\'s Punch', cost: [D, D, C], damage: 80, damageCalculation: '+' as '+',
      text: 'If any of your Benched Pancham have any damage counters on them, this attack does 120 more damage.' }
  ];
  public regulationMark = 'I';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '140';
  public name = 'Pangoro';
  public fullName = 'Pangoro ASC';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-fates-collide/cinccino-2.ts (damaged Benched Pokémon)
    if (WAS_ATTACK_USED(effect, 1, this) && effect.player.bench.some(
      slot => slot.damage > 0 && slot.getPokemonCard()?.name === 'Pancham'
    )) {
      effect.damage += 120;
    }
    return state;
  }
}
