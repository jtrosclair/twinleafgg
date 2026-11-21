import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { BoardEffect } from '../../game/store/card/card-types';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { RemoveDamagePrompt } from '../../game/store/prompts/remove-damage-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { playTrainerCard } from './card-test-helpers';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const genesect = 'Genesect ex SV11B';
const genesectAlt = 'Genesect exFA SV11B';
const shuckle = 'Shuckle MEG';
const munkidori = 'Munkidori TWM';
const thorton = 'Thorton LOR';
const tome = 'Transformation Tome CRI';
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const ownBench = { ...ownActive, slot: SlotType.BENCH };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(player1: PlayerConfig) {
  const game = setupGame({
    turn: 5,
    player1: { deck: padDeck(12), ...player1 },
    player2: { active: { card: 'Regigigas ASR' }, deck: padDeck(12) },
  });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected an unresolved prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error('Test selected an illegal prompt result');
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function settle() {
  for (let prompt = pending(); prompt; prompt = pending()) {
    if (prompt instanceof WaitPrompt || prompt instanceof ShowCardsPrompt) {
      resolve(true);
    } else if (prompt instanceof ShuffleDeckPrompt) {
      const owner = store.state.players.find(player => player.id === prompt!.playerId)!;
      resolve(owner.deck.cards.map((_, index) => index));
    } else {
      return;
    }
  }
}

function use(name: string, target = ownActive) {
  const player = store.state.players[0];
  store.dispatch(new UseAbilityAction(player.id, name, target));
  settle();
}

function metalSignal(target = ownActive) {
  use('Metal Signal', target);
  expect(pending() instanceof ChooseCardsPrompt).toBe(true);
  resolve([]);
  settle();
}

function replace(trainer: string, inPlay: typeof ownActive, name: string) {
  playTrainerCard(store, store.state, 0, trainer);
  settle();
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
  resolve([inPlay]);
  const prompt = pending();
  if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected a replacement choice');
  const index = prompt.cards.cards.findIndex(card => card.fullName === name);
  if (index < 0) throw new Error('Missing replacement: ' + name);
  resolve([index]);
  settle();
}

function roundTrip() {
  const state = store.state;
  const cards = new Set(state.players.flatMap(player => [
    ...player.getPokemonInPlay().flatMap(slot => [...slot.cards, ...slot.energies.cards, ...slot.tools]),
    ...player.deck.cards, ...player.hand.cards, ...player.discard.cards, ...player.supporter.cards,
    ...player.prizes.flatMap(list => list.cards),
  ]));
  state.cardNames = [];
  cards.forEach(card => { card.id = state.cardNames.push(card.fullName) - 1; });
  const serializer = new StateSerializer();
  const restored = serializer.deserialize(serializer.serialize(state));
  store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = restored;
}

describe('Once-per-turn Ability use on a Pokémon that stays in play', () => {
  it('enforces the official same-Ability Genesect ruling through a different print', () => {
    start({ active: { card: genesect }, hand: [thorton], discard: [genesectAlt] });
    metalSignal();
    replace(thorton, ownActive, genesectAlt);
    const slot = store.state.players[0].active;
    expect(slot.getPokemonCard()?.fullName).toBe(genesectAlt);
    expect(slot.boardEffect).toContain(BoardEffect.ABILITY_USED);
    expect(() => use('Metal Signal')).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
    expect(pending()).toBeUndefined();
  });

  it('allows Shuckle to use a different Ability after Thorton and keeps the Energy and damage', () => {
    start({
      active: { card: genesect, energy: ['Grass Energy SVE'], damage: 40 },
      hand: [thorton], discard: [shuckle],
    });
    metalSignal();
    replace(thorton, ownActive, shuckle);
    const slot = store.state.players[0].active;
    expect(slot.boardEffect).not.toContain(BoardEffect.ABILITY_USED);
    expect(slot.damage).toBe(40);
    expect(slot.energies.cards.some(card => card.fullName === 'Grass Energy SVE')).toBe(true);
    use('Fermented Juice');
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    resolve([ownActive]);
    settle();
    expect(slot.damage).toBe(10);
    expect(slot.boardEffect).toContain(BoardEffect.ABILITY_USED);
  });

  it('remembers both used Abilities through intermediate cards and through a saved position', () => {
    start({
      active: { card: genesect, energy: ['Grass Energy SVE'], damage: 50 },
      hand: [tome, tome, tome, tome], discard: [shuckle],
    });
    metalSignal();
    replace(tome, ownActive, shuckle);
    use('Fermented Juice');
    resolve([ownActive]);
    settle();
    roundTrip();
    replace(tome, ownActive, genesect);
    const slot = store.state.players[0].active;
    expect(slot.damage).toBe(20);
    expect(slot.boardEffect).toContain(BoardEffect.ABILITY_USED);
    expect(() => use('Metal Signal')).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
  });

  it('preserves a shared-helper Ability through replacing it with a copy', () => {
    start({
      active: { card: shuckle, energy: ['Grass Energy SVE'], damage: 50 },
      hand: [thorton], discard: [shuckle],
    });
    use('Fermented Juice');
    resolve([ownActive]);
    settle();
    replace(thorton, ownActive, shuckle);
    expect(() => use('Fermented Juice')).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
  });

  it('retains Adrena-Brain through replacing Munkidori out and back into the same Pokémon', () => {
    start({
      active: { card: munkidori, energy: ['Darkness Energy SVE'], damage: 40 },
      hand: [tome, tome, tome, tome], discard: ['Pecharunt ex SFA'],
    });
    use('Adrena-Brain');
    expect(pending() instanceof RemoveDamagePrompt).toBe(true);
    resolve([{ from: ownActive, to: { ...ownActive, player: PlayerType.TOP_PLAYER } }]);
    settle();
    replace(tome, ownActive, 'Pecharunt ex SFA');
    replace(tome, ownActive, munkidori);
    expect(() => use('Adrena-Brain')).toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
  });

  it('keeps the inherited usage with its original Pokémon, allowing a previously used physical card in a different slot', () => {
    start({
      active: { card: genesect }, bench: [{ card: shuckle }],
      hand: [tome, tome, tome, tome], discard: [genesectAlt],
    });
    metalSignal();
    replace(tome, ownActive, genesectAlt);
    replace(tome, ownBench, genesect);
    metalSignal(ownBench);
    expect(() => use('Metal Signal', ownActive)).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
  });

  it('reads the old Metal Signal marker when replacing a Pokémon from a legacy snapshot', () => {
    start({ active: { card: genesect }, hand: [thorton], discard: [genesectAlt] });
    const player = store.state.players[0];
    player.marker.addMarker('METAL_SIGNAL_MARKER', player.active.getPokemonCard()!);
    player.active.addBoardEffect(BoardEffect.ABILITY_USED);
    roundTrip();
    replace(thorton, ownActive, genesectAlt);
    expect(() => use('Metal Signal')).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
    expect(pending()).toBeUndefined();
  });

  it('expires inherited Ability use at the correct turn boundary', () => {
    start({ active: { card: genesect }, hand: [thorton], discard: [genesectAlt] });
    metalSignal();
    replace(thorton, ownActive, genesectAlt);
    expect(() => use('Metal Signal')).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
    for (const player of store.state.players) {
      store.dispatch(new PassTurnAction(player.id));
      settle();
    }
    expect(store.state.players[0].active.boardEffect).not.toContain(BoardEffect.ABILITY_USED);
    metalSignal();
  });
});

describe('Stance Change on Aegislash', () => {
  const sword = 'Aegislash BST';
  const shield = 'Aegislash XY 86';
  const aegislashV = 'Aegislash V VIV';
  for (const [outgoing, incoming] of [[sword, shield], ['Aegislash BST 108', 'Aegislash XY']]) {
    it('honors the cross-era restriction when ' + outgoing + ' switches to ' + incoming, () => {
      start({
        active: { card: outgoing, damage: 30, energy: ['Grass Energy SVE'], tools: ['Air Balloon SSH'] },
        hand: [incoming, aegislashV],
      });
      const slot = store.state.players[0].active;
      const energy = slot.energies.cards[0];
      const tool = slot.tools[0];
      slot.pokemonPlayedTurn = 2;
      use('Stance Change');
      const prompt = pending();
      if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected a Stance Change choice');
      const indexOf = (name: string) => prompt.cards.cards.findIndex(card => card.fullName === name);
      expect(prompt.validate(prompt.decode([indexOf(aegislashV)]))).toBe(false);
      resolve([indexOf(incoming)]);
      settle();
      expect(slot.getPokemonCard()?.fullName).toBe(incoming);
      expect(slot.pokemonPlayedTurn).toBe(2);
      expect(slot.damage).toBe(30);
      expect(slot.energies.cards).toContain(energy);
      expect(slot.tools).toContain(tool);
      expect(store.state.players[0].hand.cards.some(card => card.fullName === outgoing)).toBe(true);
      expect(() => use('Stance Change')).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
      expect(pending()).toBeUndefined();
    });
  }

  it('blocks the damaged swap under Scoop-Up Block before either card moves', () => {
    start({ active: { card: sword, damage: 10 }, hand: [shield] });
    const opponent = store.state.players[1];
    const fixture = setupGame({
      player1: { active: { card: 'Mr. Mime TEU' } },
      player2: { active: { card: genesect } },
    });
    const mime = fixture.player1.active.getPokemonCard()!;
    fixture.store.cleanup();
    mime.id = 850;
    opponent.bench[0].cards = [mime];

    expect(() => use('Stance Change')).toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
    const [player] = store.state.players;
    expect(player.active.getPokemonCard()?.fullName).toBe(sword);
    expect(player.hand.cards[0].fullName).toBe(shield);
    expect(pending()).toBeUndefined();
    player.active.damage = 0;
    use('Stance Change');
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    resolve([0]);
    settle();
    expect(player.active.getPokemonCard()?.fullName).toBe(shield);
  });
});
