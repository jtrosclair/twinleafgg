import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { CardType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { GET_PLAYER_BENCH_SLOTS, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, SHUFFLE_DECK, WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Pansage extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = CardType.GRASS;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Call for Family',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.',
  },
  {
    name: 'Leech Seed',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'Heal 10 damage from this Pokémon.',
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Pansage';
  public fullName: string = 'Pansage PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call for Family
    // Ref: set-twilight-masquerade/litwick.ts (optional private search).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.deck.cards.length === 0) return state;
      if (GET_PLAYER_BENCH_SLOTS(effect.player).length === 0) return SHUFFLE_DECK(store, state, effect.player);
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        effect.player,
        { stage: Stage.BASIC },
        { min: 0, max: 1, allowCancel: false },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 10);
    }

    return state;
  }
}
