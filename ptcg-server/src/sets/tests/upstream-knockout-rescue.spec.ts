import { GameMessage } from '../../game/game-message';
import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayerType, PlayCardAction, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPrizesDestinationEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { GamePhase, GameWinner, State } from '../../game/store/state/state';
import { PokemonSlotConfig, SetupGameResult, padDeck, setupGame } from './test-helpers';

const scarf = 'Rescue Scarf DRX';
const rescue = 'Rescue Energy TM';
const arEgg = 'Lucky Egg AR';
const sshEgg = 'Lucky Egg SSH';
const bell = 'Farewell Bell FST 234';
const reversal = 'Reversal Trigger PLB';
const mew = 'Mew ex MEW';
const fire = 'Fire Energy SVE';
const lightning = 'Lightning Energy SVE';
const dark = 'Darkness Energy SVE';
const lux = 'Gravity Gemstone SCR';
const vmax = 'Garbodor VMAX EVS';
const genesect = 'Genesect EX PLB';
const city = 'Lost City LOR';
const top = 'Darkrai & Cresselia LEGEND (Top) 30C CC16';
const bottom = 'Darkrai & Cresselia LEGEND (Bottom) 30C CC17';
const photonBlaster = 'Photon Blaster';
const miraidon = { card: 'Miraidon ex SVI', energy: [lightning, lightning, dark] };
const moon = { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] };
const targetActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const targetBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

function battle(active: PokemonSlotConfig, {
  attacker = miraidon as PokemonSlotConfig, defenderBench = [{ card: 'Pecharunt ex SFA' }] as PokemonSlotConfig[],
  hand = [] as string[], stadium = false, prizeCount = 2
} = {}) {
  const game = setupGame({
    turn: 5,
    player1: { active: attacker, bench: [{ card: mew }], hand: [...hand, ...(stadium ? [city] : [])],
      deck: padDeck(10), prizeCount },
    player2: { active, bench: defenderBench, deck: padDeck(12, fire) }
  });
  if (stadium) game.player1.hand.moveCardTo(game.player1.hand.cards.find(card => card.fullName === city)!, game.player1.stadium);
  return game;
}

function watchPrizes(game: SetupGameResult, verify: () => void) {
  const reduce = game.store.reduceEffect.bind(game.store);
  let calls = 0;
  spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof CheckPrizesDestinationEffect) {
      ++calls;
      verify();
    }
    return reduce(state, effect);
  });
  return () => expect(calls).toBeGreaterThan(0);
}

function legend(game: SetupGameResult) {
  const half = game.player1.hand.cards.find(card => card.fullName === bottom)!;
  game.player1.hand.moveCardTo(half, game.player1.active);
  const stack = game.player1.active.cards;
  stack.unshift(stack.pop()!);
  game.overridePrompt('Choose energy', () => [0, 1]);
}

describe('Knock Out rescue and Tool timing', () => {
  for (const source of [rescue, scarf]) {
    const attachments = { energy: source === rescue ? [fire, rescue] : [fire], tools: source === scarf ? [scarf] : [] };
    it(`resolves ${source} before the final Prize and returns the whole evolution stack`, () => {
      const game = battle({ card: 'Arceus VSTAR BRS', damage: 60, ...attachments }, { hand: ['Arceus V BRS'] });
      const { store, player1, player2 } = game;
      const basic = player1.hand.cards[0];
      player1.hand.cards.splice(0, 1);
      player2.active.cards.unshift(basic);
      const topCard = player2.active.getPokemonCard()!;
      const attachmentCards = [...player2.active.cards.filter(card => ![basic, topCard].includes(card)),
        ...player2.active.tools];
      const nested = player2.deck.cards[0];
      player2.deck.moveCardTo(nested, topCard.cards);
      const checked = watchPrizes(game, () => {
        expect(player2.hand.cards).toEqual([basic, topCard]);
        expect(player2.discard.cards).toEqual(jasmine.arrayContaining([...attachmentCards, nested]));
        expect(topCard.cards.cards).toEqual([]);
      });
      store.dispatch(new AttackAction(player1.id, photonBlaster));
      checked();
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
      expect(player1.getPrizeLeft()).toBe(0);
    });

    it(`uses ${source} for lethal recoil from Bolt Strike`, () => {
      const game = battle({ card: mew }, { attacker: { card: 'Zekrom BLW', damage: 90,
        energy: [lightning, lightning, dark, ...(source === rescue ? [rescue] : [])], tools: attachments.tools } });
      const { store, player1, player2 } = game;
      const zekrom = player1.active.getPokemonCard()!;
      const checked = watchPrizes(game, () => expect(player1.hand.cards).toContain(zekrom));
      store.dispatch(new AttackAction(player1.id, 'Bolt Strike'));
      checked();
      expect(player1.discard.cards.some(card => card.fullName === source)).toBe(true);
      expect(player2.getPrizeLeft()).toBe(5);
    });

    it(`ignores the explicit Knock Out on a holder of ${source}`, () => {
      const game = battle({ card: mew, ...attachments }, { attacker: moon, prizeCount: 4 });
      const { store, player1, player2 } = game;
      const victim = player2.active.getPokemonCard()!;
      store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
      expect(player2.discard.cards).toContain(victim);
      expect(player2.hand.cards).not.toContain(victim);
    });
  }

  it('uses Rescue Energy recorded only in the secondary Energy list', () => {
    const { store, player1, player2 } = battle({ card: mew, energy: [rescue] });
    const card = player2.active.cards.find(item => item.fullName === rescue)!;
    const topCard = player2.active.getPokemonCard()!;
    player2.active.cards.splice(player2.active.cards.indexOf(card), 1);
    if (!player2.active.energies.cards.includes(card)) player2.active.energies.cards.push(card);
    store.dispatch(new AttackAction(player1.id, photonBlaster));
    expect(player2.hand.cards).toContain(topCard);
    expect(player2.discard.cards.filter(energy => energy === card)).toEqual([card]);
  });

  it('respects Tool Jammer when Rescue Scarf is attached', () => {
    const { store, player1, player2 } = battle({ card: mew, tools: [scarf] },
      { attacker: { ...miraidon, tools: ['Tool Jammer BST'] } });
    const card = player2.active.getPokemonCard()!;
    store.dispatch(new AttackAction(player1.id, photonBlaster));
    expect(player2.discard.cards).toContain(card);
    expect(player2.hand.cards).not.toContain(card);
  });

  it('leaves a Benched Rescue Scarf functional when the attacker has Tool Jammer', () => {
    const game = battle({ card: 'Pecharunt ex SFA' }, {
      attacker: { ...miraidon, card: 'Electivire ex DRI', tools: ['Tool Jammer BST'] },
      defenderBench: [{ card: mew, damage: 130, tools: [scarf] }]
    });
    const { store, player1, player2, overridePrompt } = game;
    const card = player2.bench[0].getPokemonCard()!;
    overridePrompt('Choose pokemon', () => [targetActive, targetBench]);
    store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
    expect(player2.hand.cards).toContain(card);
  });

  it('keeps opposing Active Tool Jammers enabled when both players attach one', () => {
    const jammer = 'Tool Jammer BST';
    const { state, store, player1, player2 } = battle({ card: mew, tools: [jammer] },
      { attacker: { ...miraidon, tools: [jammer] } });
    expect(IS_TOOL_BLOCKED(store, state, player1, player1.active.tools[0] as TrainerCard)).toBe(false);
    expect(IS_TOOL_BLOCKED(store, state, player2, player2.active.tools[0] as TrainerCard)).toBe(false);
  });

  it('respects Spectral Breach when Rescue Energy is attached', () => {
    const { store, player1, player2 } = battle({ card: mew, energy: [rescue] },
      { defenderBench: [{ card: 'Dusknoir VIV' }] });
    const card = player2.active.getPokemonCard()!;
    store.dispatch(new AttackAction(player1.id, photonBlaster));
    expect(player2.discard.cards).toContain(card);
    expect(player2.hand.cards).not.toContain(card);
  });

  it('does not rescue a Pokémon knocked out by poison during checkup', () => {
    const { store, player1, player2 } = battle({ card: mew, damage: 170, tools: [scarf], energy: [rescue] });
    const card = player2.active.getPokemonCard()!;
    player2.active.specialConditions = [SpecialCondition.POISONED];
    store.dispatch(new PassTurnAction(player1.id));
    expect(player2.discard.cards).toContain(card);
    expect(player2.hand.cards).not.toContain(card);
  });

  for (const rescueFirst of [true, false]) {
    it(`routes Lost Crisis attachments correctly with rescue first = ${rescueFirst}`, () => {
      const game = battle({ card: mew, damage: 80, energy: [rescue, fire], tools: [lux] },
        { attacker: { card: top, energy: [dark, dark, dark, dark] }, hand: [bottom] });
      const { store, player1, player2, overridePrompt } = game;
      legend(game);
      const holder = player2.active.getPokemonCard()!;
      const attached = [...player2.active.cards.filter(card => card !== holder), ...player2.active.tools];
      const nested = player2.deck.cards[0];
      player2.deck.moveCardTo(nested, holder.cards);
      overridePrompt('Select', prompt => {
        const select = prompt as SelectPrompt;
        expect(select.message).toBe(GameMessage.CHOOSE_KNOCK_OUT_EFFECT);
        expect(select.playerId).toBe(player1.id);
        expect(select.values).toEqual(jasmine.arrayContaining(['Rescue Energy', 'Lost Crisis']));
        return select.values.indexOf(rescueFirst ? 'Rescue Energy' : 'Lost Crisis');
      });
      store.dispatch(new AttackAction(player1.id, 'Lost Crisis'));
      expect(player2.lostzone.cards).toEqual(jasmine.arrayContaining([...attached, nested]));
      expect(player2.lostzone.cards.includes(holder)).toBe(!rescueFirst);
      expect(player2.hand.cards.includes(holder)).toBe(rescueFirst);
      expect(store.state.phase).toBe(GamePhase.FINISHED);
    });

    it(`routes Lost City with Rescue Scarf first = ${rescueFirst}`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: mew, energy: [fire], tools: [scarf] }, { stadium: true });
      const holder = player2.active.getPokemonCard()!;
      const tool = player2.active.tools[0];
      overridePrompt('Select', prompt => {
        const select = prompt as SelectPrompt;
        return select.values.indexOf(rescueFirst ? 'Rescue Scarf' : 'Lost City');
      });
      store.dispatch(new AttackAction(player1.id, photonBlaster));
      expect(player2.lostzone.cards.includes(holder)).toBe(!rescueFirst);
      expect(player2.hand.cards.includes(holder)).toBe(rescueFirst);
      expect(player2.discard.cards).toContain(tool);
    });

    it(`resolves Rescue Energy and Gift Energy in the selected order = ${rescueFirst}`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: mew, energy: [rescue, 'Gift Energy LOR'] });
      const holder = player2.active.getPokemonCard()!;
      overridePrompt('Select', prompt => (prompt as SelectPrompt).values.indexOf(rescueFirst ? 'Rescue Energy' : 'Gift Energy'));
      store.dispatch(new AttackAction(player1.id, photonBlaster));
      expect(player2.hand.cards).toContain(holder);
      expect(player2.hand.cards.length).toBe(rescueFirst ? 7 : 8);
    });
  }

  for (const lostOutFirst of [true, false]) {
    it(`orders Lost Out and Lost City with Lost Out first = ${lostOutFirst}`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: mew, damage: 50, energy: [fire] },
        { attacker: { card: 'Tyranitar-GX LOT', energy: [dark, dark, dark] }, stadium: true });
      const holder = player2.active.getPokemonCard()!;
      const energy = player2.active.cards.find(card => card.fullName === fire)!;
      overridePrompt('Select', prompt => (prompt as SelectPrompt).values.indexOf(lostOutFirst ? 'Lost Out' : 'Lost City'));
      store.dispatch(new AttackAction(player1.id, 'Dusty Ruckus'));
      expect(player2.lostzone.cards).toContain(holder);
      expect(player2.lostzone.cards.includes(energy)).toBe(lostOutFirst);
      expect(player2.discard.cards.includes(energy)).toBe(!lostOutFirst);
    });
  }

  for (const tool of [arEgg, sshEgg]) {
    it(`applies only the printed discard condition for ${tool} under Lost City`, () => {
      const { store, player1, player2 } = battle({ card: mew, tools: [tool] }, { stadium: true });
      const card = player2.active.getPokemonCard()!;
      store.dispatch(new AttackAction(player1.id, photonBlaster));
      expect(player2.lostzone.cards).toContain(card);
      expect(player2.hand.cards.length).toBe(tool === arEgg ? 0 : 7);
    });

    it(`draws with ${tool} on a Benched holder knocked out by Dual Bolt`, () => {
      const game = battle({ card: 'Pecharunt ex SFA' }, {
        attacker: { ...miraidon, card: 'Electivire ex DRI' }, defenderBench: [{ card: mew, damage: 130, tools: [tool] }]
      });
      const { store, player1, player2, overridePrompt } = game;
      const holder = player2.bench[0].getPokemonCard()!;
      const checked = watchPrizes(game, () => {
        expect(player2.hand.cards.length).toBe(7);
        if (tool === arEgg) expect(player2.discard.cards).toContain(holder);
      });
      overridePrompt('Choose pokemon', () => [targetActive, targetBench]);
      store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
      checked();
    });
  }

  it('does not draw with the Arceus Lucky Egg when Rescue Energy returns the holder', () => {
    const { store, player1, player2 } = battle({ card: mew, tools: [arEgg], energy: [rescue] });
    const holder = player2.active.getPokemonCard()!;
    store.dispatch(new AttackAction(player1.id, photonBlaster));
    expect(player2.hand.cards).toEqual([holder]);
  });

  it('attaches Farewell Bell through normal play as a Pokémon Tool', () => {
    const { store, player1 } = battle({ card: mew }, { attacker: { card: vmax }, hand: [bell] });
    const tool = player1.hand.cards[0];
    store.dispatch(new PlayCardAction(player1.id, 0, ownActive));
    expect((tool as TrainerCard).trainerType).toBe(TrainerType.TOOL);
    expect(player1.active.tools).toEqual([tool]);
    expect(player1.discard.cards).not.toContain(tool);
  });

  for (const [tool, required] of [[bell, vmax], [reversal, genesect]]) {
    it(`searches before discard with ${tool} on a qualifying holder`, () => {
      const game = battle({ card: required, damage: required === vmax ? 110 : 0, tools: [tool] }, { prizeCount: 2 });
      const { store, player1, player2, overridePrompt } = game;
      const holder = player2.active.getPokemonCard()!;
      const selected = player2.deck.cards[0];
      let searches = 0;
      overridePrompt('Choose cards', () => {
        ++searches;
        expect(player2.active.getPokemonCard()).toBe(holder);
        return [0];
      });
      store.dispatch(new AttackAction(player1.id, photonBlaster));
      expect(searches).toBe(1);
      expect(player2.hand.cards).toContain(selected);
      expect(player2.discard.cards).toContain(holder);
    });

    it(`ignores a Knock Out effect on the holder of ${tool} despite a stale damage flag`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: required, tools: [tool] }, { attacker: moon });
      const toolCard = player2.active.tools[0] as unknown as { damageDealt: boolean };
      toolCard.damageDealt = true;
      overridePrompt('Choose cards', () => { throw new Error('Unexpected deck search'); });
      store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    });

    it(`does not search with ${tool} on an ineligible Pokémon`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: mew, tools: [tool] });
      overridePrompt('Choose cards', () => { throw new Error('Unexpected deck search'); });
      store.dispatch(new AttackAction(player1.id, photonBlaster));
      expect(player2.hand.cards.length).toBe(0);
    });
  }
});
