import { AttackAction, RetreatAction } from '../../game/store/actions/game-actions';
import { CardType, Stage } from '../../game/store/card/card-types';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckAttackCostEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GamePhase } from '../../game/store/state/state';
import { useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const clefable = 'Mega Clefable ex M3';
const spidops = 'Spidops ex SVI';
const ariados = 'Ariados TWM';
const dark = 'Darkness Energy SVE';
const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const ball = 'Air Balloon MEG';
const klawf = 'Klawf ex OBF';
const entei = 'Entei OBF';

describe('Active attack-cost Abilities', () => {
  for (const tax of ['Espathra ex PAF', 'Seismitoad OBF']) {
    for (const [attacker, extra] of [[mew, 1], [clefable, 0], ['Flutter Mane TEF', 0]] as const) {
      it(`${tax} applies ${extra} extra Energy against ${attacker}`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: attacker }, deck: padDeck(8) },
          player2: { active: { card: tax }, deck: padDeck(8) },
        });
        const attack = g.player1.active.getPokemonCard()!.attacks[0];
        const effect = new CheckAttackCostEffect(g.player1, attack);
        g.store.reduceEffect(g.state, effect);
        expect(effect.cost).toEqual([...attack.cost, ...Array(extra).fill(CardType.COLORLESS)]);
      });
    }
  }

  it('preserves the printed Crawdaunt cost while the damaged attacker pays exactly one Darkness', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Crawdaunt M1L', energy: [dark], damage: 10 }, deck: padDeck(8) },
      player2: { active: { card: 'Espathra ex PAF' }, deck: padDeck(8) },
    });
    const attack = g.player1.active.getPokemonCard()!.attacks[1];
    const printed = attack.cost.slice();
    const active = g.player1.active;
    active.attackCostIncreaseDuringNextTurn = 1;
    const check = new CheckAttackCostEffect(g.player1, attack);
    g.store.reduceEffect(g.state, check);
    expect(check.cost).toEqual([CardType.DARK]);
    expect(attack.cost).toEqual(printed);
    active.damage = 0;
    const healed = new CheckAttackCostEffect(g.player1, attack);
    g.store.reduceEffect(g.state, healed);
    expect(healed.cost).toEqual([...printed, CardType.COLORLESS]);
    active.damage = 10;
    g.store.dispatch(new AttackAction(g.player1.id, attack.name));
    expect(g.store.state.players[1].active.damage).toBe(130);
  });
});

describe('Retreat-cost Ability timing and damage', () => {
  for (const [holder, support, expected] of [
    [mew, spidops, 1], [mew, ariados, 0], [clefable, spidops, 1],
    ['Pidgeotto MEW', ariados, 1],
  ] as const) {
    it(`${support} calculates ${expected} current Retreat Cost for ${holder}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: holder }, deck: padDeck(8) },
        player2: { active: { card: mew }, bench: [{ card: support }], deck: padDeck(8) },
      });
      const retreat = new CheckRetreatCostEffect(g.player1);
      g.store.reduceEffect(g.state, retreat);
      expect(retreat.cost.length).toBe(expected);
    });
  }

  it('combines both Spidops with Air Balloon and Beach Court before clamping to zero', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: mew, tools: [ball] }, bench: [{ card: 'Pidgey MEW' }], deck: padDeck(8) },
      player2: { active: { card: spidops }, bench: [{ card: spidops }], deck: padDeck(8) },
    });
    g.player2.stadium.cards.push(getCardByName('Beach Court SVI'));
    const retreat = new CheckRetreatCostEffect(g.player1);
    g.store.reduceEffect(g.state, retreat);
    expect(retreat.cost).toEqual([]);
    g.store.dispatch(new RetreatAction(g.player1.id, 0));
    expect(g.store.state.players[0].active.getPokemonCard()?.fullName).toBe('Pidgey MEW');
  });

  it('gives the official Melt Away exception precedence over Big Net', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: "Ethan's Magcargo DRI" }, deck: padDeck(8) },
      player2: { active: { card: ariados }, deck: padDeck(8) },
    });
    const cost = new CheckRetreatCostEffect(g.player1);
    g.store.reduceEffect(g.state, cost);
    expect(cost.cost).toEqual([]);
  });

  it('honors Voltaic Float against both retreat-cost increases', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Zapdos ex MEW', energy: ['Lightning Energy SVE'] }, deck: padDeck(8) },
      player2: { active: { card: 'Mega Chandelure ex M5' }, bench: [{ card: spidops }], deck: padDeck(8) },
    });
    const cost = new CheckRetreatCostEffect(g.player1);
    g.store.reduceEffect(g.state, cost);
    expect(cost.cost).toEqual([]);
  });

  for (const [source, attack, defender, energy, expected] of [
    [spidops, 'Wire Hang', mew, [grass, grass], 120],
    [ariados, 'String Bind', 'Pidgeotto MEW', [grass], 40],
    [spidops, 'Wire Hang', 'Iron Bundle PAR', [grass, grass], 90],
    ['Mega Chandelure ex M5', 'Phantom Maze', 'Latias ex SSP', ['Psychic Energy SVE', 'Psychic Energy SVE'], 130],
  ] as const) {
    it(`${attack} uses the effective Retreat Cost of ${defender}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: source, energy: [...energy] }, deck: padDeck(8) },
        player2: { active: { card: defender, tools: defender === 'Iron Bundle PAR'
          ? ['Future Booster Energy Capsule PAR'] : [] }, bench: [{ card: clefable }], deck: padDeck(8) },
      });
      useAttack(g.store, g.state, 0, attack);
      expect(g.store.state.players[1].active.damage).toBe(expected);
    });
  }
});

describe('Attacker-side damage reductions', () => {
  for (const defender of [entei, 'Entei PAF']) {
    it(`applies Pressure before Water Weakness and only once from ${defender}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: 'Iron Bundle PAR' }, deck: padDeck(8) },
        player2: { active: { card: defender }, deck: padDeck(8) },
      });
      g.state.phase = GamePhase.ATTACK;
      const attack = new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]);
      g.store.reduceEffect(g.state, new DealDamageEffect(attack, 60));
      expect(g.player2.active.damage).toBe(80);
    });
  }

  it('reduces Bench damage and recoil from the opposing Active even through canceled Tool effects', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Iron Bundle PAR', tools: [ball] }, deck: padDeck(8) },
      player2: { active: { card: entei }, bench: [{ card: 'Garbodor M4' }, { card: mew }], deck: padDeck(8) },
    });
    g.player2.stadium.cards.push(getCardByName('Jamming Tower TWM'));
    g.state.phase = GamePhase.ATTACK;
    const attack = new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]);
    for (const target of [g.player1.active,g.player2.bench[1]]) {
      const effect = new PutDamageEffect(attack, 60);
      effect.target = target;
      g.store.reduceEffect(g.state, effect);
      expect(target.damage).toBe(20);
    }
    const garbodor = g.player2.bench[0].getPokemonCard()!;
    expect(garbodor.stage).toBe(Stage.STAGE_1);
    expect(garbodor.retreat.length).toBe(3);
  });

  it('does not reduce the attack of a Pokémon protected from opposing Abilities', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: clefable, tools: [ball] }, deck: padDeck(8) },
      player2: { active: { card: entei }, bench: [{ card: 'Garbodor M4 57' }], deck: padDeck(8) },
    });
    g.state.phase = GamePhase.ATTACK;
    const attack = new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]);
    g.store.reduceEffect(g.state, new DealDamageEffect(attack, 60));
    expect(g.player2.active.damage).toBe(60);
  });
});

describe('Klawf ex printed effects', () => {
  for (const [attacker, attack, discarded] of [
    ['Cornerstone Mask Ogerpon ex TWM', 'Demolish', 1],
    [clefable, 'Shooting Moon', 0],
  ] as const) {
    it(`discards ${discarded} Energy from ${attacker} after Klawf takes lethal damage`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: attacker, energy: ['Fighting Energy SVE', 'Psychic Energy SVE', 'Psychic Energy SVE'] },
          deck: padDeck(8) },
        player2: { active: { card: klawf, damage: 110 }, bench: [{ card: mew }], deck: padDeck(8) },
      });
      let choices = 0;
      g.overridePrompt('Choose cards', prompt => {
        expect(prompt.playerId).toBe(g.player2.id);
        choices++;
        return [2];
      });
      useAttack(g.store, g.state, 0, attack);
      expect(choices).toBe(discarded);
      expect(g.store.state.players[0].active.energies.cards.length).toBe(3 - discarded);
      expect(g.store.state.players[1].discard.cards.some(card => card.fullName === klawf)).toBe(true);
    });
  }

  for (const heads of [true, false]) {
    it(`resolves Falling Press with ${heads ? 'heads' : 'tails'}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: klawf, energy: ['Fighting Energy SVE',water,water] }, deck: padDeck(8) },
        player2: { active: { card: clefable }, deck: padDeck(8) },
      });
      spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      useAttack(g.store, g.state, 0, 'Falling Press');
      expect(g.store.state.players[1].active.damage).toBe(heads ? 180 : 100);
    });
  }
});
