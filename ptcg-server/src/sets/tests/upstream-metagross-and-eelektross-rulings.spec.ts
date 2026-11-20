import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const metagross = ['Metagross M4', 'Metagross M4 61'];
const megaEelektross = 'Mega Eelektross ex M2a';
const metal = 'Metal Energy SVE';
const psychic = 'Psychic Energy SVE';
const lightning = 'Lightning Energy SVE';
const luminous = 'Luminous Energy PAL';
const dragapult = 'Dragapult ex TWM';
const mew = 'Mew ex MEW';
const slowking = 'Slowking SCR';
const banette = 'Banette M5';

type Game = ReturnType<typeof setupGame>;

function resolveEnergyChoice(game: Game, expectedType: CardType, expectedCount: number) {
  let prompt: ChooseEnergyPrompt | undefined;
  game.overridePrompt('Choose energy', raw => {
    prompt = raw as ChooseEnergyPrompt;
    expect(prompt.message).toBe(GameMessage.CHOOSE_ENERGIES_TO_DISCARD);
    expect(prompt.cost).toEqual(Array(expectedCount).fill(expectedType));
    expect(prompt.options.allowCancel).toBe(false);
    const selected: number[] = [];
    let units = 0;
    for (const [index, energy] of prompt.energy.entries()) {
      if (units >= expectedCount) break;
      selected.push(index);
      units += energy.provides.length;
    }
    return selected;
  });
  return () => prompt;
}

function metalGame(card: string, energy: string[], copying = false) {
  return setupGame({ turn: 5,
    player1: {
      active: { card: copying ? slowking : card, energy },
      deck: copying ? [card, ...padDeck(9)] : padDeck(10),
    },
    player2: { active: { card: dragapult }, bench: [{ card: mew }, { card: 'Pidgeot ex OBF' }], deck: padDeck(10) }
  });
}

for (const card of metagross) {
  describe(card, () => {
    it('registers the printed HP and plays Bounce Back for one Metal with the opponent choosing', () => {
      const game = metalGame(card, [metal]);
      expect(game.player1.active.getPokemonCard()?.hp).toBe(180);
      const defender = game.player2.active.getPokemonCard();
      let chosen = false;
      game.overridePrompt('Choose pokemon', raw => {
        const prompt = raw as ChoosePokemonPrompt;
        expect(prompt.playerId).toBe(game.player2.id);
        expect(prompt.playerType).toBe(PlayerType.BOTTOM_PLAYER);
        expect(game.player2.active.damage).toBe(60);
        chosen = true;
        return [{ player: prompt.playerType, slot: SlotType.BENCH, index: 1 }];
      });
      useAttack(game.store, game.state, 0, 'Bounce Back');
      expect(chosen).toBe(true);
      expect(game.player2.bench[1].getPokemonCard()).toBe(defender);
      expect(game.player2.bench[1].damage).toBe(60);
      expect(game.player2.active.getPokemonCard()?.fullName).toBe('Pidgeot ex OBF');
    });

    it('applies ordinary Bounce Back damage when Ghost Veil blocks the switch', () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card, energy: [metal] }, deck: padDeck(10) },
        player2: { active: { card: banette }, bench: [{ card: mew }], deck: padDeck(10) }
      });
      let showed = false;
      game.overridePrompt('Choose pokemon', () => { showed = true; return []; });
      useAttack(game.store, game.state, 0, 'Bounce Back');
      expect(showed).toBe(false);
      expect(game.player2.active.getPokemonCard()?.fullName).toBe(banette);
      expect(game.player2.active.damage).toBe(60);
    });

    it('lets the defender choose when Bounce Back is copied', () => {
      const game = metalGame(card, [psychic, psychic], true);
      game.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Bounce Back' }));
      let chosen = false;
      game.overridePrompt('Choose pokemon', raw => {
        const prompt = raw as ChoosePokemonPrompt;
        expect(prompt.playerId).toBe(game.player2.id);
        expect(game.player2.active.damage).toBe(60);
        chosen = true;
        return [{ player: prompt.playerType, slot: SlotType.BENCH, index: 1 }];
      });
      useAttack(game.store, game.state, 0, 'Seek Inspiration');
      expect(chosen).toBe(true);
      expect(game.player2.active.getPokemonCard()?.fullName).toBe('Pidgeot ex OBF');
    });

    it('pays three of four attached Metal Energy on a direct Metallic Hammer', () => {
      const game = metalGame(card, [metal, metal, metal, metal]);
      game.overridePrompt('Confirm', () => true);
      const energyPrompt = resolveEnergyChoice(game, CardType.METAL, 3);
      useAttack(game.store, game.state, 0, 'Metallic Hammer');
      expect(energyPrompt()?.energy.length).toBe(4);
      expect(game.player1.discard.cards.map(card => card.fullName)).toEqual([metal, metal, metal]);
      expect(game.player1.active.energies.cards.map(card => card.fullName)).toEqual([metal]);
      expect(game.player2.active.damage).toBe(300);
    });

    for (const [energy, units, discarded] of [
      [[psychic, psychic], 0, []],
      [[psychic, metal], 1, [metal]],
      [[psychic, metal, luminous], 2, [metal, luminous]],
    ] as const) {
      it(`gives copied Metallic Hammer its bonus with ${units} qualifying units`, () => {
        const game = metalGame(card, [...energy], true);
        game.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Metallic Hammer' }));
        game.overridePrompt('Confirm', () => true);
        const energyPrompt = resolveEnergyChoice(game, CardType.METAL, units);
        useAttack(game.store, game.state, 0, 'Seek Inspiration');
        expect(!!energyPrompt()).toBe(units > 0);
        expect(game.player1.discard.cards.map(card => card.fullName).sort()).toEqual([card, ...discarded].sort());
        expect(game.player2.active.damage).toBe(300);
      });
    }

    it('lets a player decline the optional increase and keep their Energy', () => {
      const game = metalGame(card, [metal, metal, metal, metal]);
      game.overridePrompt('Confirm', () => false);
      const energyPrompt = resolveEnergyChoice(game, CardType.METAL, 3);
      useAttack(game.store, game.state, 0, 'Metallic Hammer');
      expect(energyPrompt()).toBeUndefined();
      expect(game.player1.active.energies.cards.length).toBe(4);
      expect(game.player2.active.damage).toBe(150);
    });
  });
}

describe('Metallic Hammer special Energy', () => {
  it('pays three Metal units with one Reversal Energy', () => {
    const reversal = 'Reversal Energy PAL';
    const game = setupGame({ turn: 5,
      player1: { active: { card: slowking, energy: [reversal] }, prizeCount: 6,
        deck: [metagross[0], ...padDeck(9)] },
      player2: { active: { card: dragapult }, prizeCount: 5, deck: padDeck(10) }
    });
    game.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Metallic Hammer' }));
    game.overridePrompt('Confirm', () => true);
    const energyPrompt = resolveEnergyChoice(game, CardType.METAL, 3);
    useAttack(game.store, game.state, 0, 'Seek Inspiration');
    expect(energyPrompt()?.energy.map(entry => entry.provides.length)).toEqual([3]);
    expect(game.player1.discard.cards.map(card => card.fullName)).toEqual([metagross[0], reversal]);
    expect(game.player2.active.damage).toBe(300);
  });

  it('registers the Japanese and English print identities separately', () => {
    const jp = getCardByName(metagross[0]);
    const en = getCardByName(metagross[1]);
    expect([jp.set, jp.setNumber, jp.fullName]).toEqual(['M4', '59', metagross[0]]);
    expect([en.set, en.setNumber, en.fullName]).toEqual(['CRI', '61', metagross[1]]);
  });
});

describe('Mega Eelektross ex', () => {
  for (const [energy, units] of [
    [[psychic, psychic, psychic], 0],
    [[psychic, psychic, lightning], 1],
    [[psychic, lightning, luminous], 2],
  ] as const) {
    it(`allows copied Disaster Shock with ${units} available Lightning units`, () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: mew, energy: [...energy] }, deck: padDeck(9) },
        player2: { active: { card: megaEelektross }, deck: padDeck(10) }
      });
      game.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Disaster Shock' }));
      game.overridePrompt('Confirm', () => {
        expect(game.player2.active.damage).toBe(190);
        expect(game.player2.active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
        return true;
      });
      const energyPrompt = resolveEnergyChoice(game, CardType.LIGHTNING, units);
      useAttack(game.store, game.state, 0, 'Genome Hacking');
      expect(!!energyPrompt()).toBe(units > 0);
      expect(game.player1.discard.cards.length).toBe(units);
      expect(game.player2.active.damage).toBe(190);
      expect(game.player2.active.specialConditions).toContain(SpecialCondition.PARALYZED);
    });
  }

  it('pays Lightning but Ghost Veil stops Disaster Shock paralysis', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: megaEelektross, energy: [lightning, lightning, lightning] }, deck: padDeck(10) },
      player2: { active: { card: banette }, deck: padDeck(10) }
    });
    game.player2.active.getPokemonCard()!.hp = 350;
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof DealDamageEffect) {
        expect(game.player1.active.energies.cards.length).toBe(3);
      }
      if (effect instanceof AddSpecialConditionsEffect) {
        expect(game.player1.active.energies.cards.length).toBe(1);
      }
      return reduce(state, effect);
    });
    game.overridePrompt('Confirm', () => true);
    resolveEnergyChoice(game, CardType.LIGHTNING, 2);
    useAttack(game.store, game.state, 0, 'Disaster Shock');
    expect(game.player1.discard.cards.length).toBe(2);
    expect(game.player2.active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
    expect(game.player2.active.damage).toBe(190);
  });

  for (const benchSize of [0, 1]) {
    it(`uses Split Bomb with ${benchSize} Benched Pokémon and applies only Active Weakness`, () => {
      const squawk = 'Squawkabilly ex PAL';
      const game = setupGame({ turn: 5,
        player1: { active: { card: megaEelektross, energy: [lightning, lightning] }, deck: padDeck(9) },
        player2: { active: { card: squawk }, bench: benchSize ? [{ card: squawk }] : [], deck: padDeck(10) }
      });
      game.overridePrompt('Choose pokemon', raw => {
        const prompt = raw as ChoosePokemonPrompt;
        expect(prompt.options.min).toBe(1 + benchSize);
        expect(prompt.options.max).toBe(1 + benchSize);
        const targets = [{ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }];
        if (benchSize) targets.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 });
        return targets;
      });
      useAttack(game.store, game.state, 0, 'Split Bomb');
      expect(game.player2.active.damage).toBe(120);
      expect(game.player2.bench[0].damage).toBe(benchSize ? 60 : 0);
    });
  }
});
