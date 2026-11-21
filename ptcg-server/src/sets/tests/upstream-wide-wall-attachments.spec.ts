import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CopiedSupporterEffect } from '../../game/store/effects/play-card-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { playTrainerCard } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const rhyperior = 'Rhyperior SCR';
const mew = 'Mew ex MEW';
const energy = 'Jet Energy PAL';
const basic = 'Fire Energy SVE';
const tool = 'Bravery Charm PAL';
const stadium = 'Artazon PAL';
const rust = 'Rust Syndicate Grunt M5';
const flannery = 'Flannery CRE';
const giacomo = 'Giacomo PAL';
const faba = 'Faba LOT';
const xerosic = 'Xerosic PHF';
const plumeria = 'Plumeria BUS';
const ruffian = 'Ruffian JTG';
const topActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const topBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

function setup(name: string, wideWall: boolean, attachedBench = true) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: mew }, hand: name === plumeria ? [name, basic, basic] : [name], deck: padDeck(10) },
    player2: { active: { card: wideWall ? rhyperior : mew, energy: [energy], tools: [tool] },
      bench: attachedBench ? [{ card: mew, energy: [energy], tools: [tool] }] : [], deck: padDeck(10) }
  });
  if (name === rust) game.player1.pokemonKnockedOutDuringOpponentsLastTurn = true;
  return game;
}

describe('Wide Wall against Supporter attachment removal', () => {
  const cases = [
    { name: 'Team Star Grunt SVI', zone: 'deck', activeOnly: true },
    { name: 'Team Flare Grunt GEN', zone: 'discard', activeOnly: true },
    { name: 'Team Yell Grunt SSH', zone: 'hand' },
    { name: rust, zone: 'discard' },
    { name: plumeria, zone: 'discard' },
    { name: flannery, zone: 'discard' },
    { name: faba, zone: 'lostzone', choose: 1 },
    { name: xerosic, zone: 'discard', choose: 1 },
    { name: ruffian, zone: 'discard' },
    { name: giacomo, zone: 'discard', activeOnly: true },
  ] as const;
  for (const item of cases) {
    const { name, zone } = item;
    for (const wideWall of [false, true]) {
      it(`${name} ${wideWall ? 'leaves the protected attachment' : 'moves the chosen attachment'}`, () => {
        const game = setup(name, wideWall, name !== giacomo);
        const target = 'activeOnly' in item ? game.player2.active : game.player2.bench[0];
        if (!('activeOnly' in item)) game.overridePrompt('Choose pokemon', () => [topBench]);
        if ('choose' in item) game.overridePrompt('Select', () => item.choose);
        if (name === flannery) game.player2.stadium.cards.push(getCardByName(stadium));
        const attached = target.energies.cards[0];
        playTrainerCard(game.store, game.state, 0, name);
        expect(target.energies.cards.includes(attached)).toBe(wideWall);
        expect(game.player2[zone].cards.includes(attached)).toBe(!wideWall);
        if (name === 'Team Star Grunt SVI' && !wideWall) expect(game.player2.deck.cards[0]).toBe(attached);
        if (name === ruffian) expect(target.tools.length).toBe(wideWall ? 1 : 0);
        if (name === plumeria) expect(game.player1.discard.cards.filter(card => card.fullName === basic).length).toBe(2);
        if (name === flannery) expect(game.player2.discard.cards.some(card => card.fullName === stadium)).toBe(true);
        expect(game.player1.supporterTurn).toBe(1);
      });
    }
  }

  for (const name of [faba, xerosic]) {
    it(`${name} leaves a Tool attached to a protected Benched Pokémon`, () => {
      const game = setup(name, true);
      game.overridePrompt('Select', () => 0);
      game.overridePrompt('Choose pokemon', () => [topBench]);
      playTrainerCard(game.store, game.state, 0, name);
      expect(game.player2.bench[0].tools.map(card => card.fullName)).toEqual([tool]);
    });
  }

  it("leaves the user's own Tool eligible for Xerosic", () => {
    const game = setup(xerosic, true);
    const attachment = getCardByName(tool);
    game.player1.active.cards.push(attachment);
    game.player1.active.tools.push(attachment);
    game.overridePrompt('Select', () => 0);
    game.overridePrompt('Choose pokemon', () => [ownActive]);
    playTrainerCard(game.store, game.state, 0, xerosic);
    expect(game.player1.active.tools).toEqual([]);
    expect(game.player1.discard.cards).toContain(attachment);
  });

  it('can put a Stadium in the Lost Zone with Faba under Wide Wall', () => {
    const game = setup(faba, true);
    const field = getCardByName(stadium);
    game.player2.stadium.cards.push(field);
    game.overridePrompt('Select', () => 2);
    playTrainerCard(game.store, game.state, 0, faba);
    expect(game.player2.lostzone.cards).toContain(field);
  });

  it('can discard just a Stadium with Flannery when no Special Energy is attached', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: mew }, hand: [flannery], deck: padDeck(10) },
      player2: { active: { card: rhyperior, energy: [basic] }, deck: padDeck(10) }
    });
    const field = getCardByName(stadium);
    game.player2.stadium.cards.push(field);
    playTrainerCard(game.store, game.state, 0, flannery);
    expect(game.player2.discard.cards).toContain(field);
    expect(game.player2.active.energies.cards.length).toBe(1);
  });

  it('can discard just Special Energy with Flannery when no Stadium is in play', () => {
    const game = setup(flannery, false, false);
    game.overridePrompt('Choose pokemon', () => [topActive]);
    playTrainerCard(game.store, game.state, 0, flannery);
    expect(game.player2.active.energies.cards).toEqual([]);
  });

  it('resolves every Giacomo target and discards exactly one Special Energy from each', () => {
    const game = setup(giacomo, false);
    const remaining = getCardByName(energy);
    game.player2.active.cards.push(remaining);
    game.player2.active.energies.cards.push(remaining);
    playTrainerCard(game.store, game.state, 0, giacomo);
    expect(game.player2.active.energies.cards.length).toBe(1);
    expect(game.player2.bench[0].energies.cards.length).toBe(0);
    expect(game.player2.discard.cards.filter(card => card.fullName === energy).length).toBe(2);
  });

  it('allows Rust Syndicate Grunt alongside other hand cards after a qualifying Knock Out', () => {
    const game = setup(rust, false);
    game.player1.hand.cards.push(getCardByName(basic));
    game.overridePrompt('Choose pokemon', () => [topBench]);
    playTrainerCard(game.store, game.state, 0, rust);
    expect(game.player2.bench[0].energies.cards).toEqual([]);
    expect(game.player1.hand.cards.map(card => card.fullName)).toEqual([basic]);
  });

  it('requires the previous-turn Knock Out before Rust Syndicate Grunt can be played', () => {
    const game = setup(rust, false);
    game.player1.pokemonKnockedOutDuringOpponentsLastTurn = false;
    expect(() => playTrainerCard(game.store, game.state, 0, rust))
      .toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(game.player1.supporterTurn).toBe(0);
  });

  it('allows a copied Supporter effect to move the attachment through Wide Wall', () => {
    const game = setup('Team Flare Grunt GEN', true, false);
    const source = game.player1.hand.cards[0] as TrainerCard;
    game.player1.hand.moveCardTo(source, game.player2.hand);
    const attachment = game.player2.active.energies.cards[0];
    game.store.reduceEffect(game.state, new CopiedSupporterEffect(game.player1, source));
    const pending = game.state.prompts.find(prompt => prompt.result === undefined)!;
    expect(pending instanceof ChooseCardsPrompt).toBe(true);
    (game.store as any).reducePrompt(game.state, new ResolvePromptAction(pending.id, [attachment]));
    expect(game.player2.discard.cards).toContain(attachment);
    expect(game.player2.hand.cards).toContain(source);
    expect(game.player1.supporterTurn).toBe(0);
  });
});
