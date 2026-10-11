import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from "../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

/** #25 — Spark */
export class Pikachu25 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [{
    name: 'Spark',
    cost: [CardType.LIGHTNING, CardType.COLORLESS],
    damage: 20,
    text: 'This attack also does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spark
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
      }
    }
    return state;
  }
}
