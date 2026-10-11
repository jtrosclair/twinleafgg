import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, DISCARD_ALL_ENERGY_FROM_POKEMON } from '../../game/store/prefabs/prefabs';

// Printed text: https://api.tcgdex.net/v2/en/cards/30th-053
export class EnglishPikachuEx53 extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp = 190;
  public cardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public regulationMark = 'J';
  public set = '30C';
  public setNumber = '53';
  public usSetNumber = '30C 53';
  public name = 'Pikachu ex';
  public fullName = 'Pikachu ex 30C 53';
  public cardImage = 'assets/cardback.png';
  public attacks = [{
    name: 'Pika-Pika Parade', cost: [CardType.COLORLESS], damage: 0,
    text: 'Search your deck for any number of Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
  }, {
    name: 'Thunderbolt', cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS], damage: 200,
    text: 'Discard all Energy from this Pokémon.'
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const free = player.bench.filter(b => b.cards.length === 0).length;
      if (free === 0 || player.deck.cards.length === 0) { return state; }
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player,
        { stage: Stage.BASIC }, { min: 0, max: free, allowCancel: false });
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }
    return state;
  }
}
