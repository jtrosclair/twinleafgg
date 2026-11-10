import { AttackEffect } from '../../game/store/effects/game-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Heracross Lost Thunder identity and Powerful Friends', () => {
  it('registers the correct print while retaining the historical saved identity', () => {
    const correct = getCardByName('Heracross LOT') as PokemonCard;
    const legacy = getCardByName('Heracross BRS') as PokemonCard;
    expect([correct.fullName, correct.set, correct.setNumber]).toEqual(['Heracross LOT', 'LOT', '18']);
    expect([legacy.fullName, legacy.set, legacy.setNumber]).toEqual(['Heracross BRS', 'BRS', '12']);
    expect(correct.attacks.map(a => a.name)).toEqual(legacy.attacks.map(a => a.name));
  });

  for (const bench of [false, true]) {
    it(`deals ${bench ? 120 : 30} with${bench ? '' : 'out'} a Stage 2 on the Bench`, () => {
      const game = setupGame({ turn: 3,
        player1: { active: { card: 'Heracross LOT', energy: ['Grass Energy SVE', 'Grass Energy SVE'] },
          bench: bench ? [{ card: 'Charizard ex OBF' }] : [{ card: 'Charmeleon BS' }], deck: padDeck(10) },
        player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
      });
      useAttack(game.store, game.state, 0, 'Powerful Friends');
      expect(game.player2.active.damage).toBe(bench ? 120 : 30);
    });
  }

  it('does not count an opposing Stage 2 on the Bench', () => {
    const game = setupGame({ turn: 3,
      player1: { active: { card: 'Heracross LOT', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, bench: [{ card: 'Charizard ex OBF' }], deck: padDeck(10) }
    });
    useAttack(game.store, game.state, 0, 'Powerful Friends');
    expect(game.player2.active.damage).toBe(30);
  });

  it('does not count an Active Stage 2 when resolving another Pokémon’s attack', () => {
    const game = setupGame({ turn: 3,
      player1: { active: { card: 'Charizard ex OBF' }, bench: [{ card: 'Heracross LOT' }], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const source = game.player1.bench[0].getPokemonCard()!;
    const attack = new AttackEffect(game.player1, game.player2, source.attacks[1]);
    game.store.reduceEffect(game.state, attack);
    expect(attack.damage).toBe(30);
  });
});
