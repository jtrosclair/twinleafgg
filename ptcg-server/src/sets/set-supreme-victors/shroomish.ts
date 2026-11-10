import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Shroomish extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 60;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Stun Spore", cost: [CardType.COLORLESS], damage: 0, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." },
    { name: "Tackle", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'SV';
  public setNumber = "127";
  public cardImage = 'assets/cardback.png';
  public name = "Shroomish";
  public fullName = "Shroomish SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Shroomish.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
