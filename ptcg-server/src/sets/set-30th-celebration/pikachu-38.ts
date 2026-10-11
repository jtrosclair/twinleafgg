import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from "../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

/** #38 — Targeted Spark */
export class Pikachu38 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public attacks = [{
    name: 'Targeted Spark',
    cost: [CardType.LIGHTNING],
    damage: 0,
    text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 38';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Targeted Spark
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state);
    }
    return state;
  }
}
