import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Drifloon extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 50;
  public weakness = [{ type: CardType.DARK, value: 10 }];
  public resistance = [{ type: CardType.COLORLESS, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Mind Bend", cost: [CardType.PSYCHIC], damage: 10, text: "Flip a coin. If heads, the Defending Pokémon is now Confused." },
    { name: "Gust", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = "LA";
  public setNumber = "92";
  public cardImage = 'assets/cardback.png';
  public name = "Drifloon";
  public fullName = "Drifloon LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Drifloon.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    return state;
  }
}
