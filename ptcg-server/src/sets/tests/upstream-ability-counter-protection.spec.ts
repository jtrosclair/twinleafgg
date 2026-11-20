import { ClientSimulator } from '../../client/simulator';
import { AttackAction, RetreatAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GamePhase, GameWinner } from '../../game/store/state/state';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { padDeck, setupGame } from './test-helpers';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const fixture: string = zlib.gunzipSync(fs.readFileSync(path.resolve(__dirname,
  '../../../../tools/fixtures/hide-n-sneak-attack.snapshot.json.gz'))).toString();
const hand = (slot: SlotType, index = 0) => ({ player: PlayerType.BOTTOM_PLAYER, slot, index });
const opposing = (slot: SlotType, index = 0) => ({ player: PlayerType.TOP_PLAYER, slot, index });
const rocket = (name: string) => `Team Rocket's ${name} DRI`;

function game(active: string, opponent: string, cards: string[], options: {
  bench?: string; opposingBench?: string; tool?: string;
} = {}): ClientSimulator {
  const snapshot = JSON.parse(fixture);
  const state = snapshot[1];
  const resolve = (value: any): any => value?._type === 'Ref'
    ? value.path.split('.').map(Number).reduce((node: any, key: number) => node[key], snapshot)
    : value;
  const cardIndex = (name: string): number => {
    const index = state.cardNames.indexOf(name);
    return index >= 0 ? index : state.cardNames.push(name) - 1;
  };
  const [player, opposingPlayer] = state.players.map(resolve);
  for (const side of [player, opposingPlayer]) {
    for (const slot of [side.active, ...side.bench].map(resolve)) {
      Object.assign(slot, {
        cards: [], damage: 0, tools: [], specialConditions: [], boardEffect: [], pokemonPlayedTurn: 0,
        energies: { _type: 'CardList', cards: [] }, marker: { _type: 'Marker', markers: [] }
      });
    }
    side.stadium.cards = [];
  }
  state.turn = 5;
  state.activePlayer = 0;
  player.active.cards = [cardIndex(active)];
  if (options.bench) resolve(player.bench[0]).cards = [cardIndex(options.bench)];
  opposingPlayer.active.cards = [cardIndex(opponent)];
  if (options.tool) opposingPlayer.active.tools = [cardIndex(options.tool)];
  if (options.opposingBench) resolve(opposingPlayer.bench[0]).cards = [cardIndex(options.opposingBench)];
  player.hand.cards = cards.map(cardIndex);
  const simulator = new ClientSimulator();
  simulator.loadSnapshot({ stateData: Buffer.from(JSON.stringify(snapshot)).toString('base64') });
  return simulator;
}

function play(sim: ClientSimulator, slot: SlotType, index = 0) {
  sim.dispatch(new PlayCardAction(sim.humanPlayerId, 0, hand(slot, index)));
}

function resolveNext(sim: ClientSimulator, result: any) {
  const prompt = sim.state.prompts.find(p => p.result === undefined);
  expect(prompt).toBeDefined();
  sim.resolvePrompt(prompt!.id, result);
}

function playNamed(sim: ClientSimulator, name: string, slot = SlotType.BOARD, index = 0) {
  const handIndex = sim.state.players[0].hand.cards.findIndex(card => card.fullName === name);
  expect(handIndex).toBeGreaterThan(-1);
  sim.dispatch(new PlayCardAction(sim.humanPlayerId, handIndex, hand(slot, index)));
}

function chooseNamed(sim: ClientSimulator, ...names: string[]) {
  const prompt = sim.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
  expect(prompt).toBeDefined();
  const indices = names.map(name => prompt.cards.cards.findIndex(card => card.fullName === name));
  expect(indices.every(index => index >= 0)).toBe(true);
  sim.resolvePrompt(prompt.id, indices);
}

describe('Revenge of the Assassin with Battle Cage protection', () => {
  it('wins the saved puzzle after legally replacing Battle Cage', () => {
    const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.resolve(__dirname,
      '../../../../tools/fixtures/revenge-of-the-assassin.snapshot.json.gz'))).toString());
    const sim = new ClientSimulator();
    sim.loadSnapshot(snapshot);

    playNamed(sim, rocket('Petrel'));
    chooseNamed(sim, rocket('Factory'));
    playNamed(sim, rocket('Factory'));
    expect(sim.state.players[0].stadium.cards[0].fullName).toBe(rocket('Factory'));

    playNamed(sim, rocket('Crobat ex'), SlotType.BENCH, 1);
    resolveNext(sim, true);
    resolveNext(sim, [opposing(SlotType.ACTIVE), opposing(SlotType.BENCH, 0)]);
    expect(sim.state.players[0].getPrizeLeft()).toBe(3);

    playNamed(sim, 'Poke Pad POR');
    chooseNamed(sim, rocket('Golbat'));
    playNamed(sim, rocket('Golbat'), SlotType.BENCH, 0);
    resolveNext(sim, true);
    resolveNext(sim, [opposing(SlotType.BENCH, 4)]);

    playNamed(sim, 'Ultra Ball ASC');
    chooseNamed(sim, rocket('Proton'), rocket('Sneasel'));
    chooseNamed(sim, rocket('Crobat ex'));
    playNamed(sim, rocket('Crobat ex'), SlotType.BENCH, 2);
    resolveNext(sim, true);
    resolveNext(sim, [opposing(SlotType.ACTIVE), opposing(SlotType.BENCH, 4)]);
    // Counter placement takes both prizes from Clefairy despite Lillie's Pearl.
    expect(sim.state.players[0].getPrizeLeft()).toBe(1);

    playNamed(sim, 'Ultra Ball ASC');
    chooseNamed(sim, rocket('Transceiver'), rocket('Articuno'));
    chooseNamed(sim, rocket('Arbok'));
    playNamed(sim, rocket('Arbok'), SlotType.BENCH, 3);
    playNamed(sim, 'Darkness Energy SVE', SlotType.BENCH, 3);
    sim.dispatch(new RetreatAction(sim.humanPlayerId, 3));
    sim.dispatch(new AttackAction(sim.humanPlayerId, 'Spinning Tail'));
    expect(sim.state.phase).toBe(GamePhase.FINISHED);
    expect(sim.state.winner).toBe(GameWinner.PLAYER_1);
  });
});

describe('upstream preventable ability counters', () => {
  for (const source of ['Gengar CIN', 'Gengar ex TEF', 'Arctozolt DAA', 'Arctozolt SHF SV46', 'Jolteon HIF']) {
    it(`${source} damages an unprotected opponent after attaching Energy from hand`, () => {
      const sim = game('Dhelmise M5', source, ['Psychic Energy SVE']);
      play(sim, SlotType.ACTIVE);
      const target = sim.state.players[0].active;
      expect(target.energies.cards.length).toBe(1);
      expect(target.damage).toBe(20);
    });
    it(`${source} respects Hide n Sneak on the Pokémon receiving Energy`, () => {
      const sim = game('Banette M5', source, ['Psychic Energy SVE']);
      play(sim, SlotType.ACTIVE);
      const target = sim.state.players[0].active;
      expect(target.energies.cards.length).toBe(1);
      expect(target.damage).toBe(0);
    });
  }

  it('does not apply Electromagnetic Wall from the Bench', () => {
    const sim = game('Dhelmise M5', 'Dhelmise M5', ['Psychic Energy SVE'], { opposingBench: 'Jolteon HIF' });
    play(sim, SlotType.ACTIVE);
    expect(sim.state.players[0].active.damage).toBe(0);
  });

  it('does not apply Arctozolt counters when the owner attaches Energy', () => {
    const sim = game('Arctozolt DAA', 'Dhelmise M5', ['Psychic Energy SVE']);
    play(sim, SlotType.ACTIVE);
    expect(sim.state.players[0].active.damage).toBe(0);
  });

  it('does not apply Gnawing Curse when a hand attachment is rejected', () => {
    const g = setupGame({
      turn: 5, player1: { active: { card: 'Dhelmise M5' }, hand: ['Psychic Energy SVE'], deck: padDeck(10) },
      player2: { active: { card: 'Gengar ex TEF' }, deck: padDeck(10) }
    });
    g.player1.active.energyAttachBlockedFromHandNextTurn = true;
    const energy = g.player1.hand.cards[0] as EnergyCard;
    expect(() => g.store.reduceEffect(g.state, new AttachEnergyEffect(g.player1, energy, g.player1.active))).toThrow();
    expect(g.player1.active.damage).toBe(0);
    expect(g.player1.hand.cards).toContain(energy);
  });

  it('does not apply Gnawing Curse to an attachment from the discard pile', () => {
    const g = setupGame({
      turn: 5, player1: { active: { card: 'Dhelmise M5' }, discard: ['Psychic Energy SVE'], deck: padDeck(10) },
      player2: { active: { card: 'Gengar ex TEF' }, deck: padDeck(10) }
    });
    const energy = g.player1.discard.cards[0] as EnergyCard;
    g.player1.discard.moveCardTo(energy, g.player1.active);
    g.store.reduceEffect(g.state, new AttachEnergyEffect(g.player1, energy, g.player1.active, 'discard'));
    expect(g.player1.active.damage).toBe(0);
  });

  it('checks Hide n Sneak on the evolved Pokémon when Dark Ampharos reacts', () => {
    const sim = game('Shuppet JTG', 'Dark Ampharos TRR', ['Banette M5']);
    play(sim, SlotType.ACTIVE);
    expect(sim.state.players[0].active.getPokemonCard()!.fullName).toBe('Banette M5');
    expect(sim.state.players[0].active.damage).toBe(0);
  });

  it('applies old Darkest Impulse only once in a turn', () => {
    const sim = game('Shuppet JTG', 'Dark Ampharos TRR', ['Banette JTG', 'Sinistcha TWM'], {
      bench: 'Poltchageist TWM'
    });
    play(sim, SlotType.ACTIVE);
    play(sim, SlotType.BENCH);
    expect(sim.state.players[0].active.damage).toBe(20);
    expect(sim.state.players[0].bench[0].damage).toBe(0);
  });

  it('allows declining Sneaky Bite without opening a target prompt', () => {
    const sim = game(rocket('Zubat'), 'Dhelmise M5', [rocket('Golbat')]);
    play(sim, SlotType.ACTIVE);
    expect(sim.state.prompts.find(p => p.result === undefined) instanceof ConfirmPrompt).toBe(true);
    resolveNext(sim, false);
    expect(sim.state.prompts.some(p => p.result === undefined)).toBe(false);
    expect(sim.state.players[1].active.damage).toBe(0);
  });

  it('protects against Sneaky Bite after a hand evolution', () => {
    const sim = game(rocket('Zubat'), 'Banette M5', [rocket('Golbat')]);
    play(sim, SlotType.ACTIVE);
    resolveNext(sim, true);
    resolveNext(sim, [opposing(SlotType.ACTIVE)]);
    expect(sim.state.players[1].active.damage).toBe(0);
  });

  it('checks both Bite About targets independently after evolving a Crobat reprint', () => {
    const sim = game(rocket('Golbat'), 'Banette M5', [rocket('Crobat ex3')], {
      opposingBench: 'Dhelmise M5'
    });
    play(sim, SlotType.ACTIVE);
    resolveNext(sim, true);
    const choice = sim.state.prompts.find(p => p.result === undefined) as ChoosePokemonPrompt;
    expect(sim.state.players[0].active.getPokemonCard()?.fullName).toBe(rocket('Crobat ex3'));
    expect(choice.options.min).toBe(2);
    resolveNext(sim, [opposing(SlotType.ACTIVE), opposing(SlotType.BENCH)]);
    expect(sim.state.players[1].active.damage).toBe(0);
    expect(sim.state.players[1].bench[0].damage).toBe(20);
  });

  const costs = [
    ['Meowscarada ex PAL', 'Bouquet Magic', 'Grass Energy SVE', SlotType.BENCH, 30],
    ['Volcarona-GX CEC', 'Flaming Shot', 'Fire Energy SVE', SlotType.ACTIVE, 20],
    ['Greninja XY', 'Water Shuriken', 'Water Energy SVE', SlotType.ACTIVE, 30]
  ] as const;
  for (const [source, power, energy, slot, damage] of costs) {
    for (const target of ['Banette M5', 'Dhelmise M5']) {
      it(`${power} pays its cost and applies the correct counters to ${target}`, () => {
        const sim = game(source, slot === SlotType.ACTIVE ? target : 'Dhelmise M5', [energy],
          slot === SlotType.BENCH ? { opposingBench: target } : {});
        sim.dispatch(new UseAbilityAction(sim.humanPlayerId, power, hand(SlotType.ACTIVE)));
        resolveNext(sim, [0]);
        resolveNext(sim, [opposing(slot)]);
        expect(sim.state.players[0].hand.cards.length).toBe(0);
        const cardList = slot === SlotType.ACTIVE ? sim.state.players[1].active : sim.state.players[1].bench[0];
        expect(cardList.damage).toBe(target === 'Banette M5' ? 0 : damage);
      });
    }
  }

  for (const printing of ['Starmie MEW', 'Starmie PAF']) {
    for (const target of ['Banette M5', 'Dhelmise M5']) {
      it(`${printing} discards itself only if it places counters on ${target}`, () => {
        const sim = game('Dhelmise M5', target, [], { bench: printing });
        sim.dispatch(new UseAbilityAction(sim.humanPlayerId, 'Mysterious Comet', hand(SlotType.BENCH)));
        expect(sim.state.players[0].bench[0].getPokemonCard()?.fullName).toBe(printing);
        resolveNext(sim, [opposing(SlotType.ACTIVE)]);
        const protectedTarget = target === 'Banette M5';
        expect(sim.state.players[1].active.damage).toBe(protectedTarget ? 0 : 20);
        expect(Boolean(sim.state.players[0].bench[0].getPokemonCard())).toBe(protectedTarget);
        if (protectedTarget) {
          expect(() => sim.dispatch(new UseAbilityAction(sim.humanPlayerId, 'Mysterious Comet', hand(SlotType.BENCH)))).toThrow();
        } else {
          expect(sim.state.players[0].discard.cards.some(card => card.fullName === printing)).toBe(true);
        }
      });
    }
  }

  for (const heads of [true, false]) {
    it(`Surprise Attack deals ${heads ? 30 : 0} on ${heads ? 'heads' : 'tails'}`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Galarian Zigzagoon SSH', energy: ['Darkness Energy SVE', 'Psychic Energy SVE'] }, deck: padDeck(10) },
        player2: { active: { card: 'Pikachu BS' }, deck: padDeck(10) }
      });
      spyOn(Math, 'random').and.returnValue(heads ? 0 : 0.99);
      g.store.dispatch(new AttackAction(g.player1.id, 'Surprise Attack'));
      expect(g.store.state.players[1].active.damage).toBe(heads ? 30 : 0);
    });
  }

  it('protects against Headbutt Tantrum after a hand-to-Bench play', () => {
    const sim = game('Dhelmise M5', 'Banette M5', ['Galarian Zigzagoon SSH']);
    play(sim, SlotType.BENCH);
    resolveNext(sim, [opposing(SlotType.ACTIVE)]);
    expect(sim.state.players[1].active.damage).toBe(0);
  });
});
