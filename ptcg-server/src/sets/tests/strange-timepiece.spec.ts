import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StrangeTimepiece } from '../set-mega-evolution/strange-timepiece';
import { playTrainerCard } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

describe('Strange Timepiece MEG', () => {
  it('is playable only when an evolved Psychic Pokémon is in play', () => {
    const game = setupGame({
      turn: 3,
      player1: { active: { card: 'Abra BS' }, deck: padDeck(10) },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });
    const timepiece = new StrangeTimepiece();
    expect(timepiece.canPlay!(game.store, game.state, game.player1)).toBe(false);
    game.player1.active.cards.push(getCardByName('Kadabra BS'));
    expect(timepiece.canPlay!(game.store, game.state, game.player1)).toBe(true);
  });

  it('also recognizes an eligible Pokémon on the Bench', () => {
    const game = setupGame({
      turn: 3,
      player1: { active: { card: 'Abra BS' }, bench: [{ card: 'Kadabra BS' }], deck: padDeck(10) },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });
    const timepiece = new StrangeTimepiece();
    game.player1.bench[0].cards.unshift(getCardByName('Abra BS'));
    expect(timepiece.canPlay!(game.store, game.state, game.player1)).toBe(true);
  });

  it('does not treat opposing Psychic evolutions or your non-Psychic evolutions as eligible', () => {
    const game = setupGame({
      turn: 3,
      player1: { active: { card: 'Charmeleon BS' }, deck: padDeck(10) },
      player2: { active: { card: 'Kadabra BS' }, deck: padDeck(10) }
    });
    game.player1.active.cards.unshift(getCardByName('Charmander BS'));
    game.player2.active.cards.unshift(getCardByName('Abra BS'));
    expect(new StrangeTimepiece().canPlay(game.store, game.state, game.player1)).toBe(false);
  });

  it('should leave Kadabra on top when the chain was stored out of order', () => {
    const game = setupGame({
      turn: 3,
      player1: {
        active: { card: 'Alakazam BS' },
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });

    const timepiece = new StrangeTimepiece();
    timepiece.id = 5001;
    game.player1.hand.cards.push(timepiece);

    const active = game.player1.active;
    const abra = getCardByName('Abra BS') as PokemonCard;
    const kadabra = getCardByName('Kadabra BS') as PokemonCard;
    const alakazam = active.cards[0] as PokemonCard;
    // Scrambled: Stage 1, Basic, Stage 2 — matches the reported board (Abra face-up, Kadabra "attached").
    active.cards = [kadabra, abra, alakazam];

    playTrainerCard(game.store, game.state, 0, 'Strange Timepiece MEG');

    expect(active.getPokemonCard()?.name).toBe('Kadabra');
    expect(active.getPokemons().map(p => p.name)).toEqual(['Abra', 'Kadabra']);
    expect(game.player1.hand.cards.some(c => c.name === 'Alakazam')).toBe(true);
    expect(active.pokemonPlayedTurn).toBe(game.state.turn);
  });
});
