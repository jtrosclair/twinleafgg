import { setupGame, padDeck } from './test-helpers';
import { getEnergyCount, useAttack } from './card-test-helpers';

describe('Xerneas STS — Geomancy', () => {
  it('should attach Basic Fairy Energy from deck to two Benched Pokemon when Xerneas is Active', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: {
          card: 'Xerneas STS',
          energy: ['Fairy Energy EVO']
        },
        bench: [
          { card: 'Ralts SIT' },
          { card: 'Ralts SIT' }
        ],
        deck: [
          'Fairy Energy EVO',
          'Fairy Energy EVO',
          ...padDeck(8)
        ]
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });

    useAttack(game.store, game.state, 0, 'Geomancy');

    expect(getEnergyCount(game.state, 0, 0)).toBe(1);
    expect(getEnergyCount(game.state, 0, 1)).toBe(1);
  });
});
