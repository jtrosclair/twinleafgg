import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType } from '../../game/store/card/card-types';
import { useAttack } from './card-test-helpers';
import { getCardByName, setupGame, padDeck } from './test-helpers';

describe('August 2026 safe engine and card fixes', () => {
  it('clears all effects from the Pokémon that leaves the Active Spot', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Manaphy BRS' }],
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });
    const leavingActive = game.player1.active;
    const activeCard = leavingActive.getPokemonCard();
    if (!activeCard) {
      throw new Error('Expected an Active Pokémon');
    }
    leavingActive.marker.addMarker('temporary-effect', activeCard, 'ability');

    game.player1.switchPokemon(game.player1.bench[0]);

    expect(game.player1.bench[0].marker.markers).toEqual([]);
  });

  it('puts a discarded non-Basic Fire Pokémon onto the Bench with Spirit Burner', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Chandelure UNM', energy: ['Fire Energy SVE'] },
        deck: ['Chandelure UNM', ...padDeck(4)]
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });

    useAttack(game.store, game.state, 0, 'Spirit Burner');

    expect(game.player1.bench.some(slot => slot.getPokemonCard()?.fullName === 'Chandelure UNM')).toBe(true);
  });

  it('registers Pumpkaboo XY as a Psychic Pokémon', () => {
    const pumpkaboo = getCardByName('Pumpkaboo XY');
    if (!(pumpkaboo instanceof PokemonCard)) {
      throw new Error('Expected Pumpkaboo XY to be a Pokémon card');
    }

    expect(pumpkaboo.cardType).toBe(CardType.PSYCHIC);
  });
});
