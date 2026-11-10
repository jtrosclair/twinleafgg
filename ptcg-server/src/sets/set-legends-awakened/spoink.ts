import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { optionalSelfSwitchAfterDamage } from '../round26-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Spoink extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 50;

  public cardType: CardType = P;

  public weakness = [{ type: P, value: +10 }];

  public retreat = [C];

  public attacks = [{
    name: 'Psybeam',
    cost: [P],
    damage: 0,
    text: 'The Defending Pokémon is now Confused.'
  },
  {
    name: 'Bounce',
    cost: [C, C],
    damage: 20,
    text: 'You may switch Spoink with 1 of your Benched Pokémon.'
  }];

  public set: string = 'LA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';

  public name: string = 'Spoink';

  public fullName: string = 'Spoink LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Spoink.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    // Ref: sets/round26-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) optionalSelfSwitchAfterDamage(state, effect);
    return state;
  }
}
