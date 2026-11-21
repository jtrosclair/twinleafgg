import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { GamePhase, State } from '../../game/store/state/state';
import { useAbility, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const dark = 'Darkness Energy SVE';
const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const mew = 'Mew ex MEW';
const clefable = 'Mega Clefable ex M3';
const toxtricity = 'Toxtricity M2';
const yveltal = 'Yveltal M1L';
const ogerpon = 'Cornerstone Mask Ogerpon ex TWM';
const wishiwashi = 'Wishiwashi 30C';
const scrafty = 'Mega Scrafty ex M2a';
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const otherBench = { ...bench, player: PlayerType.TOP_PLAYER };

describe('Sinister Surge attachment and timing', () => {
  it('only offers Benched Darkness Pokémon and places counters after attaching and shuffling', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: yveltal }, bench: [{ card: yveltal }, { card: mew }, { card: toxtricity }], deck: [dark, water] },
      player2: { active: { card: mew }, deck: padDeck(8) },
    });
    g.overridePrompt('Attach energy', raw => {
      const prompt = raw as AttachEnergyPrompt;
      expect(prompt.slots).toEqual([SlotType.BENCH]);
      expect(prompt.options.blockedTo).toContain({ ...bench, index: 1 });
      expect(() => prompt.decode([{ index: 0, to: active }], g.state))
        .toThrow(new GameError(GameMessage.INVALID_PROMPT_RESULT));
      return [{index: 0, to: bench}];
    });
    const original = g.store.reduceEffect.bind(g.store);
    const effects: string[] = [];
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AttachEnergyEffect) {
        effects.push('attach');
        expect(effect.sourceZone).toBe('deck');
        expect(effect.sourceCard?.fullName).toBe(toxtricity);
      }
      if (effect instanceof PlaceDamageCountersEffect) {
        effects.push('counters');
        expect(effect.sourcePower?.name).toBe('Sinister Surge');
        expect(effect.target.energies.cards.map(card => card.fullName)).toEqual([dark]);
        expect(g.state.prompts.some(p => p.type === 'Shuffle deck' && p.result === undefined)).toBe(false);
      }
      return original(state, effect);
    });
    useAbility(g.store, g.state, 0, 'Sinister Surge');
    expect(effects).toEqual(['attach', 'counters']);
    expect(g.player1.active.damage).toBe(0);
    expect(g.player1.bench[0].damage).toBe(20);
    expect(g.player1.deck.cards.map(card => card.fullName)).toEqual([water]);
  });

  it('allows a private deck search to fail and spends the use without placing counters', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: toxtricity }, bench: [{ card: yveltal }], deck: [water] },
      player2: { active: { card: mew }, deck: padDeck(8) },
    });
    g.overridePrompt('Attach energy', () => []);
    useAbility(g.store, g.state, 0, 'Sinister Surge');
    expect(g.player1.bench[0].damage).toBe(0);
    expect(g.player1.bench[0].energies.cards).toEqual([]);
    expect(() => useAbility(g.store, g.state, 0, 'Sinister Surge'))
      .toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
  });

  it('rejects activation when the Active holder is the only Darkness Pokémon', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: toxtricity }, bench: [{ card: mew }], deck: [dark] },
      player2: { active: { card: mew }, deck: padDeck(8) },
    });
    expect(() => useAbility(g.store, g.state, 0, 'Sinister Surge'))
      .toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
    expect(g.state.prompts).toEqual([]);
  });
});

describe('Mortal Shuriken protection after paying the Basic Water cost', () => {
  for (const greninja of ['Mega Greninja ex M4', 'Mega Greninja ex M4 22']) {
    for (const target of [clefable, mew]) {
      it(`uses the printed counters from ${greninja} against ${target}`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: greninja }, hand: [water,water], deck: padDeck(8) },
          player2: { active: { card: mew }, bench: [{card:target}], deck: padDeck(8) },
        });
        g.overridePrompt('Choose cards', () => [0]);
        g.overridePrompt('Choose pokemon', () => {
          expect(g.player1.discard.cards.map(card => card.fullName)).toEqual([water]);
          return [otherBench];
        });
        useAbility(g.store, g.state, 0, 'Mortal Shuriken');
        expect(g.player2.bench[0].damage).toBe(target === clefable ? 0 : 60);
        expect(g.player2.active.damage).toBe(0);
        expect(() => useAbility(g.store, g.state, 0, 'Mortal Shuriken'))
          .toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
      });
    }
  }
});

describe('Active retaliation counters into the original attacker', () => {
  for (const chesnaught of ['Chesnaught M4', 'Chesnaught M4 7']) {
    it(`counts four effective Grass units from two attached Energy on ${chesnaught}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: ogerpon, energy: ['Fighting Energy SVE',water,water] }, deck: padDeck(8) },
        player2: { active: { card: chesnaught, energy: [grass,grass], damage: 40 },
          bench: [{ card: 'Meganium M1S' }], deck: padDeck(8) },
      });
      useAttack(g.store, g.state, 0, 'Demolish');
      expect(g.player1.active.damage).toBe(120);
      expect(g.player2.discard.cards.some(card => card.fullName === chesnaught)).toBe(true);
    });

    it(`does not trigger retaliation on a Benched ${chesnaught} or through a suppressed Ability`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: 'Flutter Mane TEF' }, deck: padDeck(8) },
        player2: { active: { card: chesnaught, energy: [grass] },
          bench: [{ card: chesnaught, energy: [grass] }], deck: padDeck(8) },
      });
      g.state.phase = GamePhase.ATTACK;
      const attack = new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]);
      for (const target of [g.player2.active,g.player2.bench[0]]) {
        const effect = new AfterDamageEffect(attack, 20);
        effect.target = target;
        g.store.reduceEffect(g.state, effect);
      }
      expect(g.player1.active.damage).toBe(0);
    });
  }

  for (const [activeCard, ability, amount, benchCard] of [
    [scrafty, 'Counterattacking Crest', 50, mew],
    [wishiwashi, 'Counterattack Grouping', 60, wishiwashi],
    ['Wishiwashi ex M6', 'Counterattack Grouping', 30, wishiwashi],
  ] as const) {
    for (const [attacker, attack] of [[ogerpon,'Demolish'],[clefable,'Shooting Moon']] as const) {
      it(`attributes ${ability} from ${activeCard} against ${attacker}`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: attacker, energy: ['Fighting Energy SVE','Psychic Energy SVE','Psychic Energy SVE'] }, deck: padDeck(8) },
          player2: { active: { card: activeCard }, bench: [{card:benchCard}], deck: padDeck(8) },
        });
        const original = g.store.reduceEffect.bind(g.store);
        const attempts: number[] = [];
        spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
          if (effect instanceof PlaceDamageCountersEffect && effect.sourcePower?.name === ability) attempts.push(effect.damage);
          return original(state, effect);
        });
        useAttack(g.store, g.state, 0, attack);
        expect(attempts.reduce((sum,x)=>sum+x,0)).toBe(amount);
        expect(g.player1.active.damage).toBe(attacker === clefable ? 0 : amount);
      });
    }
  }
});

describe('Night Gate can be used after a Bench becomes available', () => {
  it('keeps its once-per-turn use after a successful switch only', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Gengar PAF' }, hand: ['Pidgey MEW'], deck: padDeck(8) },
      player2: { active: { card: mew }, deck: padDeck(8) },
    });
    expect(() => useAbility(g.store, g.state, 0, 'Night Gate'))
      .toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    g.store.dispatch(new PlayCardAction(g.player1.id, 0, bench));
    g.overridePrompt('Choose pokemon', () => [bench]);
    useAbility(g.store, g.state, 0, 'Night Gate');
    expect(g.store.state.players[0].active.getPokemonCard()?.fullName).toBe('Pidgey MEW');
    expect(() => useAbility(g.store, g.store.state, 0, 'Night Gate'))
      .toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
  });
});
