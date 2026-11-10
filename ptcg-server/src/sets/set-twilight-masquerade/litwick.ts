import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GET_PLAYER_BENCH_SLOTS, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Litwick extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 60;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Call for Family',
    cost: [CardType.FIRE],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
  }, {
    name: 'Live Coal',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Litwick';
  public fullName: string = 'Litwick TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-pitch-black/drilbur.ts (search for a Basic Pokémon to Bench).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      // A deck search for a subset of cards may fail, and an attack can still
      // be used when the deck is empty or the Bench is full.
      if (effect.player.deck.cards.length === 0) return state;
      if (GET_PLAYER_BENCH_SLOTS(effect.player).length === 0) {
        return SHUFFLE_DECK(store, state, effect.player);
      }
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        effect.player,
        { stage: Stage.BASIC },
        { min: 0, max: 1, allowCancel: false },
      );
    }

    return state;
  }
}
