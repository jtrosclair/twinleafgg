import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Seel extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 60;
  public weakness = [{ type: CardType.METAL, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Tail Slap", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Icy Wind", cost: [CardType.WATER, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, the Defending Pokémon is now Asleep." }
  ];
  public set = 'SV';
  public setNumber = "125";
  public cardImage = 'assets/cardback.png';
  public name = "Seel";
  public fullName = "Seel SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Seel.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    return state;
  }
}
