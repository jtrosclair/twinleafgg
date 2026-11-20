import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CheckHpEffect, CheckPrizesDestinationEffect } from '../../game/store/effects/check-effects';
import { padDeck, setupGame } from './test-helpers';

const arceus = 'Arceus VSTAR BRS';
const electivire = 'Electivire ex DRI';
const miraidon = 'Miraidon ex SVI';
const dragapult = 'Dragapult ex TWM';
const moon = 'Roaring Moon ex PAR';
const mew = 'Mew ex MEW';
const munkidori = 'Munkidori ex SFA';
const pecharunt = 'Pecharunt ex SFA';
const legacy = 'Legacy Energy TWM';
const gift = 'Gift Energy LOR';
const hope = 'Amulet of Hope SSP';
const gengar = 'Mega Gengar ex MBG';
const fire = 'Fire Energy SVE';
const dark = 'Darkness Energy SVE';
const lightning = 'Lightning Energy SVE';
const opposingActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const opposingBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };

function battle(attacker: string, target: string, config: {
  damage?: number;
  energy?: string[];
  tools?: string[];
  bench?: { card: string; damage?: number; energy?: string[] }[];
  prizeCount?: number;
} = {}) {
  const { bench = [{ card: mew }], prizeCount, ...active } = config;
  const energy = attacker === dragapult ? [fire, 'Psychic Energy SVE']
    : attacker === electivire || attacker === miraidon ? [lightning, lightning, dark] : [dark, dark, dark];
  return setupGame({
    turn: 5,
    player1: {
      prizeCount,
      active: { card: attacker, energy },
      deck: padDeck(10)
    },
    player2: { active: { card: target, ...active }, bench, deck: padDeck(12, fire) }
  });
}

describe('Knock Outs caused by opposing attack damage', () => {
  for (const [attack, partnerPresent, staleFlag, expected] of [
    ['Trinity Nova', true, false, 1],
    ['Trinity Nova', false, true, 2],
    ['Frenzied Gouging', true, true, 2],
    ['Trinity Nova', true, true, 1],
    ['Trinity Nova', false, false, 2]
  ] as const) {
    it(`awards ${expected} Prizes against Munkidori ex with ${attack}, partner ${partnerPresent}, stored flag ${staleFlag}`, () => {
      const bench = partnerPresent ? [{ card: pecharunt }, { card: mew }] : [{ card: mew }];
      const { store, player1, player2 } = battle(attack === 'Trinity Nova' ? arceus : moon, munkidori, { damage: 10, bench });
      const initialPrizes = player1.getPrizeLeft();
      player2.pecharuntexIsInPlay = staleFlag;
      store.dispatch(new AttackAction(player1.id, attack));
      expect(store.state.players[1].discard.cards.map(card => card.fullName)).toContain(munkidori);
      expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes - expected);
    });
  }

  it('awards three Prizes when Phantom Dive knocks out both Munkidori ex and Pecharunt ex', () => {
    const { store, player1, overridePrompt } = battle(dragapult, munkidori, {
      damage: 10, bench: [{ card: pecharunt, damage: 130 }, { card: mew }]
    });
    const initialPrizes = player1.getPrizeLeft();
    overridePrompt('Put damage', () => [{ target: opposingBench, damage: 60 }]);
    store.dispatch(new AttackAction(player1.id, 'Phantom Dive'));
    expect(store.state.players[1].discard.cards.map(card => card.fullName)).toEqual(jasmine.arrayContaining([munkidori, pecharunt]));
    expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes - 3);
  });

  it('uses Pecharunt ex from the same Knock Out wave even when it is removed first', () => {
    const { store, player1, overridePrompt } = battle(electivire, pecharunt, {
      damage: 140, bench: [{ card: munkidori, damage: 160 }, { card: mew }]
    });
    const initialPrizes = player1.getPrizeLeft();
    overridePrompt('Choose pokemon', () => [opposingActive, opposingBench]);
    store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
    expect(store.state.players[1].discard.cards.map(card => card.fullName)).toEqual(jasmine.arrayContaining([munkidori, pecharunt]));
    expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes - 3);
  });

  it('stacks Oh No You Don’t with Legacy Energy for zero Prizes on a qualifying Knock Out', () => {
    const { store, player1 } = battle(arceus, munkidori, { damage: 10, energy: [legacy], bench: [{ card: pecharunt }] });
    const initialPrizes = player1.getPrizeLeft();
    store.dispatch(new AttackAction(player1.id, 'Trinity Nova'));
    expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes);
    expect(store.state.players[1].legacyEnergyUsed).toBeTrue();
  });

  for (const [attacker, attack, hasPecharunt, expected] of [
    [dragapult, 'Phantom Dive', true, 0],
    [dragapult, 'Phantom Dive', false, 1],
    [moon, 'Frenzied Gouging', true, 2],
    [arceus, 'Trinity Nova', true, 1]
  ] as const) {
    it(`awards ${expected} Prizes against two Mega Gengar ex with ${attack} and Pecharunt ex ${hasPecharunt}`, () => {
      const bench = [{ card: gengar }, { card: gengar }, ...(hasPecharunt ? [{ card: pecharunt }] : [])];
      const { store, player1, overridePrompt } = battle(attacker, munkidori, { damage: 10, bench });
      const initialPrizes = player1.getPrizeLeft();
      if (attacker === dragapult) overridePrompt('Put damage', () => [{ target: opposingBench, damage: 60 }]);
      store.dispatch(new AttackAction(player1.id, attack));
      expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes - expected);
    });
  }

  for (const [damage, used, expected] of [[true, false, 1], [true, true, 2], [false, false, 2]] as const) {
    it(`applies Legacy Energy only once, with damage ${damage} and prior use ${used}`, () => {
      const { store, player1, player2 } = battle(damage ? arceus : moon, mew, { energy: [legacy] });
      const initialPrizes = player1.getPrizeLeft();
      player2.legacyEnergyUsed = used;
      store.dispatch(new AttackAction(player1.id, damage ? 'Trinity Nova' : 'Frenzied Gouging'));
      expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes - expected);
      expect(store.state.players[1].legacyEnergyUsed).toBe(damage || used);
    });
  }

  it('does not use Legacy Energy when Phantom Dive places lethal counters on its Benched holder', () => {
    const { store, player1, overridePrompt } = battle(dragapult, 'Mega Kangaskhan ex M1S', {
      bench: [{ card: mew, energy: [legacy], damage: 120 }, { card: pecharunt }]
    });
    const initialPrizes = player1.getPrizeLeft();
    overridePrompt('Put damage', () => [{ target: opposingBench, damage: 60 }]);
    store.dispatch(new AttackAction(player1.id, 'Phantom Dive'));
    expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes - 2);
    expect(store.state.players[1].legacyEnergyUsed).toBeFalse();
  });

  for (const damage of [true, false]) {
    it(`draws Gift Energy cards before prizes only when attack damage caused the Knock Out (${damage})`, () => {
      const { store, player1, player2 } = battle(damage ? arceus : moon, mew, { energy: [gift], prizeCount: 2 });
      const original = store.reduceEffect.bind(store);
      let beforePrizes: number | undefined;
      spyOn(store, 'reduceEffect').and.callFake((state, effect) => {
        if (effect instanceof CheckPrizesDestinationEffect && effect.player === player1) {
          beforePrizes = player2.hand.cards.length;
        }
        return original(state, effect);
      });
      store.dispatch(new AttackAction(player1.id, damage ? 'Trinity Nova' : 'Frenzied Gouging'));
      expect(beforePrizes).toBe(damage ? 7 : 0);
      expect(store.state.players[1].hand.cards.length).toBe(damage ? 7 : 0);
    });

    it(`searches with Amulet of Hope only when attack damage caused the Knock Out (${damage})`, () => {
      const { store, player1, player2, overridePrompt } = battle(damage ? miraidon : moon, mew, { tools: [hope], prizeCount: 2 });
      let searches = 0;
      let shuffles = 0;
      overridePrompt('Choose cards', () => {
        searches++;
        return [0, 1, 2];
      });
      overridePrompt('Shuffle deck', () => {
        shuffles++;
        expect(player2.hand.cards.length).toBe(3);
        return player2.deck.cards.map((_, index) => index);
      });
      store.dispatch(new AttackAction(player1.id, damage ? 'Photon Blaster' : 'Frenzied Gouging'));
      expect(searches).toBe(damage ? 1 : 0);
      expect(shuffles).toBe(damage ? 1 : 0);
      expect(store.state.players[1].hand.cards.length).toBe(damage ? 3 : 0);
      expect(store.state.players[0].getPrizeLeft()).toBe(0);
    });

    for (const [target, tool, hp, expected] of [
      ['Togekiss VMAX VIV', "Hero's Medal VIV", 210, damage ? 2 : 3],
      ['Dedenne-GX UNB', 'Island Challenge Amulet CEC', 60, damage ? 1 : 2]
    ] as const) {
      it(`awards ${expected} Prizes for ${target} with ${tool} when damage is ${damage}`, () => {
        const { store, player1, player2 } = battle(damage ? arceus : moon, target, { tools: [tool], damage: 20 });
        const checkHp = new CheckHpEffect(player2, player2.active);
        store.reduceEffect(store.state, checkHp);
        expect(checkHp.hp).toBe(hp);
        const initialPrizes = player1.getPrizeLeft();
        store.dispatch(new AttackAction(player1.id, damage ? 'Trinity Nova' : 'Frenzied Gouging'));
        expect(store.state.players[1].discard.cards.map(card => card.fullName)).toContain(target);
        expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes - expected);
      });
    }
  }

  it('counts distinct Island Challenge Amulets separately under Theta Double', () => {
    const amulet = 'Island Challenge Amulet CEC';
    const { store, player1, player2 } = battle(arceus, 'M Tyranitar-EX AOR', { tools: [amulet, amulet] });
    const checkHp = new CheckHpEffect(player2, player2.active);
    store.reduceEffect(store.state, checkHp);
    expect(checkHp.hp).toBe(40);
    const initialPrizes = player1.getPrizeLeft();
    store.dispatch(new AttackAction(player1.id, 'Trinity Nova'));
    expect(store.state.players[1].discard.cards.filter(card => card.fullName === amulet).length).toBe(2);
    expect(store.state.players[0].getPrizeLeft()).toBe(initialPrizes);
  });
});
