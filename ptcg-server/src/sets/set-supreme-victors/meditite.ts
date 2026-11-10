import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Meditite extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 60;
  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Psyshot", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Karate Chop", cost: [CardType.PSYCHIC, CardType.COLORLESS], damage: 30, damageCalculation: "-", text: "Does 30 damage minus 10 damage for each damage counter on Meditite." }
  ];
  public set = 'SV';
  public setNumber = "113";
  public cardImage = 'assets/cardback.png';
  public name = "Meditite";
  public fullName = "Meditite SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Meditite.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const damage = effect.source.damage;
      if (damage >= 30) effect.damage = 0; else effect.damage -= damage;
    }
    return state;
  }
}
