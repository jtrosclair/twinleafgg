import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CopiedSupporterEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { Prompt } from '../../game/store/prompts/prompt';
import { playTrainerCard, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const greedent = 'Greedent CRE';
const rhyperior = 'Rhyperior SCR';
const mew = 'Mew ex MEW';
const basic = 'Fire Energy SVE';
const fighting = 'Fighting Energy SVE';
const special = 'Jet Energy PAL';
const tool = 'Bravery Charm PAL';
const faba = 'Faba LOT';
const charisma = "Giovanni's Charisma MEW";
const fan = 'Fan of Waves BST';
const blower = 'Megaton Blower SSP';
const agatha = 'Agatha CRE';
const grimsley = 'Grimsley UNM';
const koga = "Koga's Trap UNB";
const topActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const topBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

function firstEnergyIndex(prompt: Prompt<unknown>): number[] {
  return [(prompt as ChooseCardsPrompt).cards.cards.findIndex(card => card.superType === SuperType.ENERGY)];
}

describe('Brazen Tail Trainer energy removal protection', () => {
  for (const [name, zone, turn] of [
    ['Crushing Hammer SVI', 'discard', 5],
    ['Enhanced Hammer TWM', 'discard', 5],
    ['Energy Removal BS', 'discard', 5],
    ['Energy Removal 2 PK', 'discard', 5],
    ['Super Energy Removal BS', 'discard', 5],
    ['Super Energy Removal 2 AQ', 'discard', 5],
    ['Wait and See Hammer LOT', 'discard', 2],
    ['Chill Teaser Toy SSP', 'hand', 2],
    ['Team Yell Grunt SSH', 'hand', 5],
    ['Team Star Grunt SVI', 'deck', 5],
    ['Nita TEU', 'deck', 5],
    [fan, 'deck', 5],
    [blower, 'discard', 5],
  ] as const) {
    for (const protectedEnergy of [false, true]) {
      it(name + (protectedEnergy ? ' leaves protected Energy in play' : ' moves the attachment without Brazen Tail'), () => {
        const game = setupGame({
          turn,
          player1: { active: { card: mew, energy: [basic] }, hand: [name], deck: padDeck(10) },
          player2: { active: { card: mew, energy: [special] },
            bench: [{ card: protectedEnergy ? greedent : mew }], deck: padDeck(10) }
        });
        const energy = game.player2.active.energies.cards[0];
        if (name === 'Super Energy Removal BS') {
          game.overridePrompt('Choose cards', prompt => {
            game.overridePrompt('Choose cards', firstEnergyIndex);
            return firstEnergyIndex(prompt);
          });
        }
        if (name === 'Super Energy Removal 2 AQ') spyOn(Math, 'random').and.returnValue(0);
        playTrainerCard(game.store, game.state, 0, name);
        expect(game.player2.active.energies.cards.includes(energy)).toBe(protectedEnergy);
        expect(game.player2[zone].cards.includes(energy)).toBe(!protectedEnergy);
        if (!protectedEnergy && name === fan) expect(game.player2.deck.cards[game.player2.deck.cards.length - 1]).toBe(energy);
        if (!protectedEnergy && name === 'Nita TEU') expect(game.player2.deck.cards[0]).toBe(energy);
        if (name === 'Super Energy Removal BS') expect(game.player1.active.energies.cards).toEqual([]);
      });
    }
  }

  it('prevents the return and the follow-up attachment of Giovanni’s Charisma', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: mew }, hand: [charisma, basic], deck: padDeck(10) },
      player2: { active: { card: mew, energy: [special] }, bench: [{ card: greedent }], deck: padDeck(10) }
    });
    playTrainerCard(game.store, game.state, 0, charisma);
    expect(game.player2.active.energies.cards.length).toBe(1);
    expect(game.player1.active.energies.cards).toEqual([]);
    expect(game.player1.hand.cards.map(card => card.fullName)).toEqual([basic]);
  });

  it('lets Megaton Blower discard Tools and a Stadium while preserving the protected Energy', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: mew }, hand: [blower], deck: padDeck(10) },
      player2: { active: { card: mew, energy: [special], tools: [tool] }, bench: [{ card: greedent }], deck: padDeck(10) }
    });
    const field = getCardByName('Artazon PAL');
    const attachedTool = game.player2.active.tools[0];
    game.player2.stadium.cards.push(field);
    playTrainerCard(game.store, game.state, 0, blower);
    expect(game.player2.active.energies.cards.length).toBe(1);
    expect(game.player2.active.tools).toEqual([]);
    expect(game.player2.discard.cards).toContain(attachedTool);
    expect(game.player2.discard.cards).toContain(field);
  });

  it('lets Faba put Special Energy in the Lost Zone', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: mew }, hand: [faba], deck: padDeck(10) },
      player2: { active: { card: mew, energy: [special] }, bench: [{ card: greedent }], deck: padDeck(10) }
    });
    const attachment = game.player2.active.energies.cards[0];
    playTrainerCard(game.store, game.state, 0, faba);
    expect(game.player2.lostzone.cards).toContain(attachment);
  });

  it('stops protecting Energy when Garbotoxin suppresses Greedent', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: mew }, hand: [fan], deck: padDeck(10) },
      player2: { active: { card: mew, energy: [special] },
        bench: [{ card: greedent }, { card: 'Garbodor DRX', tools: [tool] }], deck: padDeck(10) }
    });
    const attachment = game.player2.active.energies.cards[0];
    playTrainerCard(game.store, game.state, 0, fan);
    expect(game.player2.deck.cards[game.player2.deck.cards.length - 1]).toBe(attachment);
  });

  it('allows Drill Run to discard the Energy as an attack effect', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: rhyperior, energy: [fighting, basic, basic] }, deck: padDeck(10) },
      player2: { active: { card: mew, energy: [special] }, bench: [{ card: greedent }], deck: padDeck(10) }
    });
    game.player2.active.getPokemonCard()!.hp = 250;
    const attachment = game.player2.active.energies.cards[0];
    game.overridePrompt('Choose cards', firstEnergyIndex);
    useAttack(game.store, game.state, 0, 'Drill Run');
    expect(game.player2.active.energies.cards).toEqual([]);
    expect(game.player2.discard.cards).toContain(attachment);
  });

  it('allows the effect of a copied Team Flare Grunt to discard Energy', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: mew }, deck: padDeck(10) },
      player2: { active: { card: mew, energy: [special] }, hand: ['Team Flare Grunt GEN'],
        bench: [{ card: greedent }], deck: padDeck(10) }
    });
    const attachment = game.player2.active.energies.cards[0];
    const source = game.player2.hand.cards[0] as TrainerCard;
    game.store.reduceEffect(game.state, new CopiedSupporterEffect(game.player1, source));
    const prompt = game.state.prompts.find(p => p.result === undefined);
    expect(prompt instanceof ChooseCardsPrompt).toBe(true);
    (game.store as any).reducePrompt(game.state, new ResolvePromptAction(prompt!.id, [attachment]));
    expect(game.player2.discard.cards).toContain(attachment);
    expect(game.player2.hand.cards).toContain(source);
  });

  it('lets Ω Barrier prevent Crushing Hammer after heads', () => {
    const hammer = 'Crushing Hammer SVI';
    const game = setupGame({
      turn: 5, player1: { active: { card: mew }, hand: [hammer], deck: padDeck(10) },
      player2: { active: { card: 'Primal Groudon-EX PRC', energy: [special] }, deck: padDeck(10) }
    });
    const attachment = game.player2.active.energies.cards[0];
    playTrainerCard(game.store, game.state, 0, hammer);
    expect(game.player2.active.energies.cards).toContain(attachment);
    expect(game.player1.discard.cards.map(card => card.fullName)).toContain(hammer);
  });

  it('rejects Fan of Waves when the only attached Energy is Basic', () => {
    const game = setupGame({
      turn: 5, player1: { active: { card: mew }, hand: [fan], deck: padDeck(10) },
      player2: { active: { card: mew, energy: [basic] }, deck: padDeck(10) }
    });
    expect(() => playTrainerCard(game.store, game.state, 0, fan))
      .toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
  });
});

describe('Wide Wall against counter moves and Special Conditions', () => {
  for (const protectedTarget of [false, true]) {
    it('checks the destination after Agatha removes two 10-damage counters', () => {
      const game = setupGame({
        turn: 5,
        player1: { active: { card: mew, damage: 30 }, hand: [agatha], deck: padDeck(10) },
        player2: { active: { card: protectedTarget ? rhyperior : mew }, deck: padDeck(10) }
      });
      game.overridePrompt('Move damage', () => Array(2).fill({ from: ownActive, to: topActive }));
      playTrainerCard(game.store, game.state, 0, agatha);
      expect(game.player1.active.damage).toBe(10);
      expect(game.player2.active.damage).toBe(protectedTarget ? 0 : 20);
      expect(game.player1.supporterTurn).toBe(1);
    });

    it('checks both opposing targets before Grimsley can move counters', () => {
      const game = setupGame({
        turn: 5,
        player1: { active: { card: mew }, hand: [grimsley], deck: padDeck(10) },
        player2: { active: { card: protectedTarget ? rhyperior : mew, damage: 30 },
          bench: [{ card: mew }], deck: padDeck(10) }
      });
      game.overridePrompt('Move damage', () => Array(3).fill({ from: topActive, to: topBench }));
      playTrainerCard(game.store, game.state, 0, grimsley);
      expect(game.player2.active.damage).toBe(protectedTarget ? 30 : 0);
      expect(game.player2.bench[0].damage).toBe(protectedTarget ? 0 : 30);
      expect(game.player1.supporterTurn).toBe(1);
    });

    it('checks whether Koga can apply Poison and Confusion', () => {
      const game = setupGame({
        turn: 5,
        player1: { active: { card: mew }, hand: [koga], deck: padDeck(10) },
        player2: { active: { card: protectedTarget ? rhyperior : mew }, deck: padDeck(10) }
      });
      game.player2.active.poisonDamage = 30;
      playTrainerCard(game.store, game.state, 0, koga);
      expect(game.player2.active.specialConditions.includes(SpecialCondition.POISONED)).toBe(!protectedTarget);
      expect(game.player2.active.specialConditions.includes(SpecialCondition.CONFUSED)).toBe(!protectedTarget);
      expect(game.player2.active.poisonDamage).toBe(protectedTarget ? 30 : 10);
      expect(game.player1.supporterTurn).toBe(1);
    });
  }

  it('rejects Grimsley when the opponent has only one Pokémon in play', () => {
    const game = setupGame({
      turn: 5, player1: { active: { card: mew }, hand: [grimsley], deck: padDeck(10) },
      player2: { active: { card: mew, damage: 30 }, deck: padDeck(10) }
    });
    expect(() => playTrainerCard(game.store, game.state, 0, grimsley))
      .toThrow(new GameError(GameMessage.CANNOT_MOVE_DAMAGE));
  });
});
