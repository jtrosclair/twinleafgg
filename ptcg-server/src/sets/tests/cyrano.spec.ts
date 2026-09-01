import { playTrainerCard } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

describe('Cyrano SSP', () => {
  it('cannot be played after another Supporter in the same turn', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT' },
        hand: ['Cyrano SSP', 'Cyrano SSP'],
        deck: ['Pikachu ex SSP', ...padDeck(9)]
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });

    playTrainerCard(game.store, game.state, 0, 'Cyrano SSP');

    expect(() => {
      playTrainerCard(game.store, game.state, 0, 'Cyrano SSP');
    }).toThrow();
  });
});
