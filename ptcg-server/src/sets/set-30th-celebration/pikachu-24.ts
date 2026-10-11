import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

/** #24 — Volt Tackle */
export class Pikachu24 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public attacks = [{
    name: 'Volt Tackle',
    cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: 'This Pokémon also does 30 damage to itself.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 24';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Volt Tackle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }
    return state;
  }
}
