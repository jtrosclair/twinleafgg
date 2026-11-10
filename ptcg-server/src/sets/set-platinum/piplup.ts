import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { targetDamageAfter, optionalSelfSwitchAfter, healTeamAfter, coinRecoilAfter } from './round24-attack-helpers';

export class Piplup extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 60;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Muddy Water", cost: [CardType.WATER], damage: 10, text: "Does 10 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)" },
    { name: "Pound", cost: [CardType.WATER, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'PL';
  public setNumber = "85";
  public cardImage = 'assets/cardback.png';
  public name = "Piplup";
  public fullName = "Piplup PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Piplup.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) targetDamageAfter(state,effect,10);
    return state;
  }
}
