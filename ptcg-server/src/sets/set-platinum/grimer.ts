import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';

export class Grimer extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 60;
  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Division", cost: [], damage: 0, text: "Search your deck for Grimer and put it onto your Bench. Shuffle your deck afterward." },
    { name: "Poison Gas", cost: [CardType.PSYCHIC], damage: 0, text: "The Defending Pokémon is now Poisoned." }
  ];
  public set = 'PL';
  public setNumber = "75";
  public cardImage = 'assets/cardback.png';
  public name = "Grimer";
  public fullName = "Grimer PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Grimer.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state,effect,(s,next)=>searchBasicsToBench(s,next,effect,1,['Grimer']));
    if (WAS_ATTACK_USED(effect, 1, this)) conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}
