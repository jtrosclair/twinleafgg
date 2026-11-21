import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { GamePhase } from '../../game/store/state/state';
import { playTrainerCard, useAbility } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const pidgey = 'Pidgey MEW';
const clefable = 'Mega Clefable ex M3';
const poltchageist = 'Poltchageist M5';
const psychic = 'Psychic Energy SVE';
const lightning = 'Lightning Energy SVE';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const vanilluxe = 'Vanilluxe PAR';
const spiritomb = 'Spiritomb PAL';
const lumineon = 'Lumineon V BRS';
const forestStone = 'Forest Seal Stone SIT';
const hood = 'Stealthy Hood UNB';
const ironThorns = 'Iron Thorns ex TWM';
const froslass = 'Froslass TWM';
const fech = 'Fezandipiti ex SFA';
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const opposingBench = (index: number) => ({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });

describe('Flying Entry', () => {
  for (const print of ['Hawlucha SVI', 'Hawlucha PAF']) {
    for (const bench of [[pidgey], [poltchageist, pidgey], [poltchageist, pidgey, pidgey]]) {
      it(`${print} selects exactly ${Math.min(bench.length, 2)} after the completed hand-to-Bench play`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: mew }, hand: [print], deck: padDeck(8) },
          player2: { active: { card: mew }, bench: bench.map(card => ({ card })), deck: padDeck(8) },
        });
        let offers = 0;
        g.overridePrompt('Confirm', () => {
          expect(g.player1.bench[0].getPokemonCard()?.fullName).toBe(print);
          offers++;
          return true;
        });
        g.overridePrompt('Choose pokemon', raw => {
          const prompt = raw as ChoosePokemonPrompt;
          const count = Math.min(bench.length, 2);
          expect(prompt.options.min).toBe(count);
          expect(prompt.options.max).toBe(count);
          return bench.slice(0, count).map((_card, index) => opposingBench(index));
        });
        g.store.dispatch(new PlayCardAction(g.player1.id, 0, ownBench));
        expect(offers).toBe(1);
        expect(g.player2.bench.slice(0, bench.length).map(slot => slot.damage))
          .toEqual(bench.map((card, index) => index < 2 && card !== poltchageist ? 10 : 0));
      });
    }
  }

  it('does not trigger after Nest Ball or offer an unusable Ability under Mischievous Lock', () => {
    for (const fromHand of [true, false]) {
      const g = setupGame({ turn: 5,
        player1: { active: { card: mew }, hand: [fromHand ? 'Hawlucha SVI' : 'Nest Ball SVI'],
          deck: ['Hawlucha SVI', ...padDeck(8)] },
        player2: { active: { card: fromHand ? 'Klefki SVI' : mew }, bench: [{ card: pidgey }], deck: padDeck(8) },
      });
      g.overridePrompt('Confirm', () => { fail('Flying Entry should not be offered'); return false; });
      if (fromHand) g.store.dispatch(new PlayCardAction(g.player1.id, 0, ownBench));
      else {
        g.overridePrompt('Choose cards', raw => [(raw as ChooseCardsPrompt).cards.cards.findIndex(card => card.fullName === 'Hawlucha SVI')]);
        playTrainerCard(g.store, g.state, 0, 'Nest Ball SVI');
      }
      expect(g.player1.bench[0].getPokemonCard()?.fullName).toBe('Hawlucha SVI');
      expect(g.player2.bench[0].damage).toBe(0);
    }
  });
});

describe('Freezing Shroud', () => {
  it('stacks each print on Pokémon with Abilities and respects the opponent’s protected targets', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: clefable }, bench: [{ card: froslass }, { card: 'FroslassIR TWM' }], deck: padDeck(8) },
      player2: { active: { card: clefable }, bench: [{ card: poltchageist }, { card: fech }, { card: pidgey }], deck: padDeck(8) },
    });
    g.state.phase = GamePhase.BETWEEN_TURNS;
    g.store.reduceEffect(g.state, new BetweenTurnsEffect(g.player1));
    expect(g.player1.active.damage).toBe(20);
    expect(g.player1.bench.slice(0, 2).map(slot => slot.damage)).toEqual([0, 0]);
    expect(g.player2.active.damage).toBe(0);
    expect(g.player2.bench.slice(0, 3).map(slot => slot.damage)).toEqual([0, 20, 0]);
  });

  it('applies only the friendly Shroud to protected Bench Pokémon under Battle Cage', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: mew }, bench: [{ card: froslass }, { card: fech }], deck: padDeck(8) },
      player2: { active: { card: mew }, bench: [{ card: fech }], deck: padDeck(8) },
    });
    g.player1.stadium.cards.push(getCardByName('Battle Colosseum M2'));
    g.state.phase = GamePhase.BETWEEN_TURNS;
    g.store.reduceEffect(g.state, new BetweenTurnsEffect(g.player1));
    expect(g.player1.bench[1].damage).toBe(10);
    expect(g.player2.bench[0].damage).toBe(0);
  });
});

describe('Frigid Room', () => {
  for (const [card, remaining, tools, mayAttack] of [
    [mew, 50, [], true],
    [mew, 40, [], false],
    [mew, 40, [hood], true],
    [clefable, 40, [], true],
  ] as const) {
    it(`uses the real attack source with ${card}, ${remaining} HP and ${tools.join() || 'no Tool'}`, () => {
      const hp = card === mew ? 180 : 320;
      const g = setupGame({ turn: 5,
        player1: { active: { card, damage: hp - remaining, tools: [...tools], energy: [psychic, psychic, psychic] }, deck: padDeck(8) },
        player2: { active: { card: vanilluxe }, bench: [{ card: pidgey }], deck: padDeck(8) },
      });
      if (card === mew) g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Icicle Missile' }));
      const attack = () => g.store.dispatch(new AttackAction(g.player1.id, card === mew ? 'Genome Hacking' : 'Shooting Moon'));
      if (mayAttack) {
        attack();
        expect(g.store.state.players[1].active.damage).toBe(card === mew ? 110 : 120);
      } else {
        expect(attack).toThrow();
        expect(g.store.state.players[1].active.damage).toBe(0);
      }
    });
  }
});

describe('Spiritomb and Iron Thorns ex', () => {
  for (const locker of [spiritomb, 'Spiritomb PAF', ironThorns]) {
    it(`suppresses Luminous Sign while preserving Star Alchemy under ${locker}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: lumineon, tools: [forestStone] }, hand: [lumineon],
          deck: ["Boss's Orders PAL", ...padDeck(8)] },
        player2: { active: { card: locker }, deck: padDeck(8) },
      });
      const card = g.player1.active.getPokemonCard()!;
      const query = new CheckPokemonPowersEffect(g.player1, card);
      g.store.reduceEffect(g.state, query);
      expect(query.powers.map(power => power.name)).toEqual(['Star Alchemy']);
      g.overridePrompt('Confirm', () => { fail('Luminous Sign should be suppressed'); return false; });
      g.store.dispatch(new PlayCardAction(g.player1.id, 0, ownBench));
      expect(g.player1.bench[0].getPokemonCard()?.fullName).toBe(lumineon);
      expect(g.player1.hand.cards.length).toBe(0);
      // Exercise the Ability lock independently of the legacy Tool's double listener.
      const slot = g.player1.active;
      slot.cards = slot.cards.filter(attached => !slot.tools.includes(attached));
      g.store.dispatch(new UseAbilityAction(g.player1.id, 'Star Alchemy',
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }));
      expect(g.player1.usedVSTAR).toBe(true);
    });
  }

  it('lets evolution VSTAR Abilities work in play under Spiritomb', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Arceus VSTAR BRS' }, deck: padDeck(8) },
      player2: { active: { card: spiritomb }, deck: padDeck(8) },
    });
    useAbility(g.store, g.state, 0, 'Starbirth');
    expect(g.player1.usedVSTAR).toBe(true);
  });

  it('respects protection and uses Spiritomb’s owner for suppression', () => {
    for (const suppress of [false, true]) {
      const g = setupGame({ turn: 5,
        player1: { active: { card: suppress ? 'Flutter Mane TEF' : mew },
          bench: [{ card: lumineon, tools: suppress ? [] : [hood] }], deck: padDeck(8) },
        player2: { active: { card: spiritomb }, deck: padDeck(8) },
      });
      const target = g.player1.bench[0].getPokemonCard()!;
      const query = new CheckPokemonPowersEffect(g.player1, target);
      g.store.reduceEffect(g.state, query);
      expect(query.powers).toEqual(target.powers);
      expect(() => g.store.reduceEffect(g.state, new PowerEffect(g.player1, target.powers[0], target))).not.toThrow();
    }
  });

  for (const [target, available] of [
    ['Miraidon ex SVI', false], ['Iron Crown ex TEF', true], [clefable, true], [pidgey, true],
  ] as const) {
    it(`applies Initialization only when eligible to ${target}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: target }, deck: padDeck(8) },
        player2: { active: { card: ironThorns }, deck: padDeck(8) },
      });
      const card = g.player1.active.getPokemonCard()!;
      const query = new CheckPokemonPowersEffect(g.player1, card);
      g.store.reduceEffect(g.state, query);
      expect(query.powers).toEqual(available ? card.powers : []);
      if (card.powers.length && !available) {
        expect(() => g.store.reduceEffect(g.state, new PowerEffect(g.player1, card.powers[0], card))).toThrow();
      }
    });
  }

  it('applies Volt Cyclone damage before moving a selected Energy to the attacker’s Bench', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: ironThorns, energy: [lightning, water, water] }, bench: [{ card: pidgey }], deck: padDeck(8) },
      player2: { active: { card: mew }, bench: [{ card: pidgey }], deck: padDeck(8) },
    });
    let transfers = 0;
    g.overridePrompt('Attach energy', raw => {
      const prompt = raw as AttachEnergyPrompt;
      expect(g.player2.active.damage).toBe(140);
      transfers++;
      return [{ to: ownBench, index: prompt.cardList.cards.findIndex(card => card.fullName === lightning) }];
    });
    g.store.dispatch(new AttackAction(g.player1.id, 'Volt Cyclone'));
    expect(transfers).toBe(1);
    expect(g.player1.bench[0].energies.cards.map(card => card.fullName)).toEqual([lightning]);
    expect(g.player2.bench[0].energies.cards).toEqual([]);
  });
});

describe('Fade Out', () => {
  for (const [card, hit, energy] of [
    [spiritomb, 10, dark], ["Lillie's Comfey JTG", 30, psychic],
  ] as const) {
    it(`deals ${hit} and returns ${card} with its Energy and Tool`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card, energy: [energy], tools: [hood] }, bench: [{ card: pidgey }], deck: padDeck(8) },
        player2: { active: { card: mew }, deck: padDeck(8) },
      });
      g.store.dispatch(new AttackAction(g.player1.id, 'Fade Out'));
      expect(g.player2.active.damage).toBe(hit);
      expect(g.player1.active.getPokemonCard()?.fullName).toBe(pidgey);
      expect(g.player1.hand.cards.map(item => item.fullName)).toEqual(jasmine.arrayWithExactContents([card, energy, hood]));
    });
  }
});
