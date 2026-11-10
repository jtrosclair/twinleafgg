import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { targetDamageAfter, optionalSelfSwitchAfter, healTeamAfter, coinRecoilAfter } from './round24-attack-helpers';

export class Carnivine2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 80;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Poison Breath", cost: [], damage: 0, text: "Flip a coin. If heads, the Defending Pokémon is now Poisoned." },
    { name: "Sweet Saliva", cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: "Remove 1 damage counter from each of your Benched Pokémon." }
  ];
  public set = 'PL';
  public setNumber = "68";
  public cardImage = 'assets/cardback.png';
  public name = "Carnivine";
  public fullName = "Carnivine PL2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Carnivine2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.POISONED);
    if (WAS_ATTACK_USED(effect, 1, this)) healTeamAfter(state,effect,10,true);
    return state;
  }
}
