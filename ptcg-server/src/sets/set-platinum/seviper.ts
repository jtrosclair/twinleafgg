import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { targetDamageAfter, optionalSelfSwitchAfter, healTeamAfter, coinRecoilAfter } from './round24-attack-helpers';

export class Seviper extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 80;
  public weakness = [{ type: CardType.PSYCHIC, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Shed Skin", cost: [], damage: 0, text: "Remove 4 damage counters from Seviper." },
    { name: "Bite and Escape", cost: [CardType.PSYCHIC], damage: 20, text: "You may switch Seviper with 1 of your Benched Pokémon." },
    { name: "Paralyze Poison", cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS], damage: 40, text: "The Defending Pokémon is now Poisoned. Flip a coin. If heads, the Defending Pokémon is now Paralyzed and Poisoned." }
  ];
  public set = 'PL';
  public setNumber = "61";
  public cardImage = 'assets/cardback.png';
  public name = "Seviper";
  public fullName = "Seviper PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Seviper.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) healAttackerAfterDamage(state,effect,40);
    if (WAS_ATTACK_USED(effect, 1, this)) optionalSelfSwitchAfter(state,effect);
    if (WAS_ATTACK_USED(effect, 2, this)) { conditionAfterDamage(state,effect,SpecialCondition.POISONED); coinConditionAfterDamage(state,effect,SpecialCondition.PARALYZED); }
    return state;
  }
}
