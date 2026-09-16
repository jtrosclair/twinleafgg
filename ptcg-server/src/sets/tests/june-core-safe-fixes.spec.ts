import { createActiveDamageEffect, getZoneCount, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

describe('June core safe fixes', () => {
  it('Gengar & Mimikyu-GX Horror House-GX draws only while cards remain', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: {
          card: 'Gengar & Mimikyu-GX TEU',
          energy: ['Psychic Energy SVE', 'Psychic Energy SVE']
        },
        hand: padDeck(5),
        deck: ['Water Energy SVE']
      },
      player2: {
        active: { card: 'Arceus V BRS' },
        hand: padDeck(6),
        deck: []
      }
    });

    useAttack(game.store, game.state, 0, 'Horror House-GX');

    expect(getZoneCount(game.state, 0, 'hand')).toBe(6);
    expect(getZoneCount(game.state, 0, 'deck')).toBe(0);
    expect(getZoneCount(game.state, 1, 'hand')).toBe(6);
    expect(getZoneCount(game.state, 1, 'deck')).toBe(0);
  });

  it('Raichu BS evolves from Pikachu', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Raichu BS' },
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });

    expect(game.player1.active.getPokemonCard()?.evolvesFrom).toBe('Pikachu');
  });

  it('Gholdengo ex PAR Make It Rain keeps its damage after the discard prompt', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: {
          card: 'Gholdengo ex PAR',
          energy: ['Metal Energy SVE']
        },
        hand: ['Metal Energy SVE', 'Metal Energy SVE'],
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Arceus V BRS' },
        deck: padDeck(10)
      }
    });

    useAttack(game.store, game.state, 0, 'Make It Rain');

    expect(getZoneCount(game.state, 0, 'discard')).toBe(2);
    expect(getZoneCount(game.state, 0, 'hand')).toBe(0);
    expect(game.player2.active.damage).toBe(100);
  });

  it('Muscle Band XY modifies computed damage', () => {
    const game = setupGame({
      player1: {
        active: {
          card: 'Gholdengo ex PAR',
          tools: ['Muscle Band XY']
        },
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Arceus V BRS' },
        deck: padDeck(10)
      }
    });
    const effect = createActiveDamageEffect(game, 0, { damage: 0 });
    effect.damage = 100;

    game.player1.active.tools[0].reduceEffect(game.store, game.state, effect);

    expect(effect.damage).toBe(120);
  });
});
