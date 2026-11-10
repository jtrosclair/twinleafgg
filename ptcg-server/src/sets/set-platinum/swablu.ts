import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { targetDamageAfter, optionalSelfSwitchAfter, healTeamAfter, coinRecoilAfter } from './round24-attack-helpers';

export class Swablu extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 40;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [];
  public attacks = [
    { name: "Sing", cost: [CardType.COLORLESS], damage: 0, text: "The Defending Pokémon is now Asleep." },
    { name: "Run Around", cost: [CardType.COLORLESS], damage: 10, text: "You may switch Swablu with 1 of your Benched Pokémon." }
  ];
  public set = 'PL';
  public setNumber = "97";
  public cardImage = 'assets/cardback.png';
  public name = "Swablu";
  public fullName = "Swablu PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Swablu.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    if (WAS_ATTACK_USED(effect, 1, this)) optionalSelfSwitchAfter(state,effect);
    return state;
  }
}
