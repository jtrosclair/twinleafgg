import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';

export class Ivysaur extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bulbasaur';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Poison Seed',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Razor Leaf',
    cost: [G, G, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Ivysaur';
  public fullName: string = 'Ivysaur RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Ivysaur.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(_store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    }
    return state;
  }
}
