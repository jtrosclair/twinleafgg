import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { BoardEffect, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { playTrainerCard } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const zoroark = 'Zoroark EVS';
const ditto = 'Ditto MEW';
const dittoV = 'Ditto V SHF';
const palafin = 'Palafin TWM';
const hero = 'Palafin ex TWM';
const dark = 'Poochyena ASC';
const grass = 'Hoppip EVS';
const darkness = 'Darkness Energy SVE';
const charm = 'Bravery Charm PAL';
const eternatus = 'Eternatus VMAX DAA';
const switchCard = 'Switch SVI';
const water = 'Water Energy SVE';
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(left: PlayerConfig, right: Partial<PlayerConfig> = {}, turn = 5) {
  const game = setupGame({
    turn,
    player1: { deck: padDeck(12), ...left },
    player2: { active: { card: 'Regigigas ASR' }, deck: padDeck(12), ...right },
  });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function use(player: Player, power: string, target = active) {
  store.dispatch(new UseAbilityAction(player.id, power, target));
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected an unresolved prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error('Test selected an illegal prompt result');
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function animate() {
  while (pending() instanceof WaitPrompt) resolve(true);
}

function cardChoice() {
  animate();
  const prompt = pending();
  if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected a card choice');
  return prompt;
}

function cardIndex(prompt: ChooseCardsPrompt, name: string) {
  const index = prompt.cards.cards.findIndex(card => card.fullName === name);
  if (index < 0) throw new Error('Missing card in prompt: ' + name);
  return index;
}

function chooseCard(name: string) {
  resolve([cardIndex(cardChoice(), name)]);
}

function shuffle() {
  animate();
  const prompt = pending();
  if (!(prompt instanceof ShuffleDeckPrompt)) throw new Error('Expected a shuffle');
  const player = store.state.players.find(player => player.id === prompt.playerId)!;
  resolve(player.deck.cards.map((_, index) => index));
  animate();
}

function getPhysical(name: string, id: number) {
  const card = getCardByName(name);
  card.id = id;
  return card;
}

describe('Replacement with a new Pokémon', () => {
  it('discards the entire previous stack and resets history for Phantom Transformation', () => {
    const mud = 'Marshtomp CES';
    const { player1 } = start({
      active: { card: zoroark, energy: [water], damage: 30, tools: [charm] },
      hand: ['Swampert CES'], discard: [mud, 'Zoroark BLW', hero], bench: [{ card: dark }],
    });
    const outgoing = player1.active;
    const zoroarkCard = outgoing.getPokemonCard()!;
    const zorua = getPhysical('Zorua EVS', 810);
    outgoing.cards.unshift(zorua);
    const mirrorTool = getPhysical('Air Balloon SSH', 811);
    outgoing.tools.push(mirrorTool);
    const mirrorEnergy = getPhysical('Capture Energy RCL', 812);
    outgoing.energies.cards.push(mirrorEnergy);
    const prismEnergy = getPhysical('Super Boost Energy ◇ UPR', 813);
    outgoing.cards.push(prismEnergy);
    outgoing.energies.cards.push(prismEnergy);
    outgoing.specialConditions.push(SpecialCondition.POISONED);
    outgoing.pokemonPlayedTurn = 2;
    outgoing.attackCostIncreaseDuringNextTurn = 2;
    outgoing.marker.addMarker('outgoing-effect', zoroarkCard, 'attack');
    player1.marker.addMarker('active-effect', zoroarkCard, 'attack', 'pokemon');
    player1.marker.addMarker('player-effect', zoroarkCard, 'attack', 'player');
    use(player1, 'Phantom Transformation');
    const prompt = cardChoice();
    for (const illegal of ['Zoroark BLW', hero]) {
      expect(prompt.validate(prompt.decode([cardIndex(prompt, illegal)]))).toBe(false);
    }
    chooseCard(mud);
    animate();
    expect(player1.active.getPokemonCard()?.fullName).toBe(mud);
    expect(player1.active.pokemonPlayedTurn).toBe(5);
    expect(player1.active.damage).toBe(0);
    expect(player1.active.specialConditions).toEqual([]);
    expect(player1.active.attackCostIncreaseDuringNextTurn).toBe(0);
    expect(player1.active.marker.hasMarker('outgoing-effect')).toBe(false);
    expect(player1.marker.hasMarker('active-effect')).toBe(false);
    expect(player1.marker.hasMarker('player-effect')).toBe(true);
    expect(player1.discard.cards.filter(card => [zorua, zoroarkCard, mirrorTool, mirrorEnergy].includes(card)).length).toBe(4);
    expect(player1.discard.cards.filter(card => card.fullName === water || card.fullName === charm).length).toBe(2);
    expect(player1.lostzone.cards).toContain(prismEnergy);
    expect(() => store.dispatch(new PlayCardAction(player1.id, 0, active))).toThrow(new GameError(GameMessage.POKEMON_CANT_EVOLVE_THIS_TURN));
  });

  it('allows a Darkness replacement but filters non-Darkness choices under Eternal Zone', () => {
    const darkStage1 = 'Mightyena ASR';
    const { player1 } = start({
      active: { card: eternatus },
      bench: [{ card: zoroark, damage: 30 }, { card: dark }],
      discard: ['Marshtomp CES', darkStage1],
    });
    use(player1, 'Phantom Transformation', bench);
    const prompt = cardChoice();
    expect(prompt.validate(prompt.decode([cardIndex(prompt, 'Marshtomp CES')]))).toBe(false);
    chooseCard(darkStage1);
    animate();
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(darkStage1);
    expect(player1.bench[0].damage).toBe(0);
    expect(player1.bench.length).toBe(8);
    expect(player1.bench[1].getPokemonCard()?.fullName).toBe(dark);
  });

  it('refuses Phantom Transformation when the discard only offers prohibited targets', () => {
    const { player1 } = start({ active: { card: zoroark }, discard: [hero, 'Zoroark BLW'] });
    expect(() => use(player1, 'Phantom Transformation')).toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
    expect(pending()).toBeUndefined();
  });

  it('replaces first-turn Active Ditto without retaining its damage, Tool, or status', () => {
    const { player1 } = start({
      active: { card: ditto, damage: 20, energy: [water], tools: [charm] },
      deck: [ditto, dittoV, grass, ...padDeck(6)],
    }, {}, 2);
    const outgoing = player1.active.getPokemonCard()!;
    player1.active.specialConditions.push(SpecialCondition.CONFUSED);
    use(player1, 'Transformative Start');
    const prompt = cardChoice();
    expect(prompt.validate(prompt.decode([cardIndex(prompt, ditto)]))).toBe(false);
    expect(prompt.validate(prompt.decode([cardIndex(prompt, dittoV)]))).toBe(true);
    chooseCard(grass);
    shuffle();
    expect(player1.active.getPokemonCard()?.fullName).toBe(grass);
    expect(player1.active.damage).toBe(0);
    expect(player1.active.specialConditions).toEqual([]);
    expect(player1.active.tools).toEqual([]);
    expect(player1.active.energies.cards).toEqual([]);
    expect(player1.discard.cards).toContain(outgoing);
    expect(player1.discard.cards.some(card => card.fullName === charm)).toBe(true);
  });

  it('rejects Transformative Start after the first turn', () => {
    const { player1 } = start({ active: { card: ditto }, deck: [grass] }, {}, 3);
    expect(() => use(player1, 'Transformative Start')).toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
    expect(pending()).toBeUndefined();
  });
});

describe('In-place Pokémon swaps', () => {
  it('carries the consumed V Transformation onto a second Ditto V and clears it after the turn', () => {
    const alias = 'Ditto V SHF 50';
    const { player1, player2 } = start({
      active: { card: dittoV, damage: 30, energy: [water], tools: [charm] },
      discard: [alias, 'Ditto VMAX SHF', 'Indeedee V SSH'],
    });
    const target = player1.active;
    const outgoing = target.getPokemonCard()!;
    const attachedEnergy = target.energies.cards[0];
    const attachedTool = target.tools[0];
    target.specialConditions.push(SpecialCondition.POISONED);
    target.pokemonPlayedTurn = 3;
    target.attackCostIncreaseDuringNextTurn = 1;
    outgoing.retreatCostIncreaseNextTurn = 1;
    use(player1, 'V Transformation');
    const prompt = cardChoice();
    expect(prompt.validate(prompt.decode([cardIndex(prompt, 'Ditto VMAX SHF')]))).toBe(false);
    chooseCard(alias);
    animate();
    expect(player1.active).toBe(target);
    expect(target.getPokemonCard()?.fullName).toBe(alias);
    expect(target.getPokemonCard()?.retreatCostIncreaseNextTurn).toBe(1);
    expect(target.damage).toBe(30);
    expect(target.pokemonPlayedTurn).toBe(3);
    expect(target.attackCostIncreaseDuringNextTurn).toBe(1);
    expect(target.specialConditions).toEqual([SpecialCondition.POISONED]);
    expect(target.energies.cards).toContain(attachedEnergy);
    expect(target.tools).toContain(attachedTool);
    expect(target.boardEffect).toContain(BoardEffect.ABILITY_USED);
    expect(() => use(player1, 'V Transformation')).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
    const restored = store.state.players[0];
    expect(restored.active.getPokemonCard()?.fullName).toBe(alias);
    store.dispatch(new PassTurnAction(restored.id));
    animate();
    store.dispatch(new PassTurnAction(player2.id));
    animate();
    use(restored, 'V Transformation');
    chooseCard('Indeedee V SSH');
    animate();
    expect(restored.active.getPokemonCard()?.fullName).toBe('Indeedee V SSH');
    expect(restored.active.boardEffect).not.toContain(BoardEffect.ABILITY_USED);
    const beforeHealing = restored.active.damage;
    use(restored, 'Watch Over');
    animate();
    expect(restored.active.damage).toBe(beforeHealing - 20);
  });

  it('puts Palafin ex in the moved Bench position after Surfer finishes drawing', () => {
    const surfer = 'Surfer SSP';
    const { player1, state } = start({
      active: { card: palafin, damage: 20, tools: [charm], energy: [water] },
      bench: [{ card: dark }], hand: [surfer], deck: [...padDeck(5), hero, ...padDeck(4)],
    });
    const moved = player1.active;
    const base = getPhysical('Finizen TWM', 820);
    moved.cards.unshift(base);
    const energy = moved.energies.cards[0];
    const tool = moved.tools[0];
    moved.pokemonPlayedTurn = 2;
    expect(pending()).toBeUndefined();
    playTrainerCard(store, state, 0, surfer);
    animate();
    resolve([bench]);
    animate();
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    expect(player1.hand.cards.length).toBe(5);
    expect(player1.active.getPokemonCard()?.fullName).toBe(dark);
    expect(player1.bench[0]).toBe(moved);
    resolve(true);
    chooseCard(hero);
    shuffle();
    expect(player1.bench[0].getPokemons().map(card => card.fullName)).toEqual(['Finizen TWM', hero]);
    expect(moved.damage).toBe(20);
    expect(moved.pokemonPlayedTurn).toBe(2);
    expect(moved.energies.cards).toContain(energy);
    expect(moved.tools).toContain(tool);
    expect(player1.deck.cards.some(card => card.fullName === palafin)).toBe(true);
    expect(player1.deck.cards).not.toContain(base);
  });

  it('does not trigger Zero to Hero by moving into Active or during the opponent’s turn', () => {
    const { player1, player2, state } = start({
      active: { card: dark }, bench: [{ card: palafin }], hand: [switchCard], deck: [hero, ...padDeck(10)],
    });
    playTrainerCard(store, state, 0, switchCard);
    animate();
    resolve([bench]);
    animate();
    expect(pending()).toBeUndefined();
    expect(player1.active.getPokemonCard()?.fullName).toBe(palafin);
    state.activePlayer = 1;
    player1.switchPokemon(player1.bench[0], store, state);
    expect(pending()).toBeUndefined();
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(palafin);
    expect(player2.active.getPokemonCard()?.fullName).toBe('Regigigas ASR');
  });

  it('uses the same play restriction for Thorton and Transformation Tome', () => {
    for (const hand of [['Thorton LOR'], ['Transformation Tome CRI', 'Transformation Tome CRI']]) {
      const { player1, state } = start({
        active: { card: eternatus }, bench: [{ card: dark }], hand,
        discard: [grass, 'Murkrow PAL'],
      });
      playTrainerCard(store, state, 0, hand[0]);
      animate();
      const target = pending();
      if (!(target instanceof ChoosePokemonPrompt)) throw new Error('Expected in-play Pokémon selection');
      expect(target.validate(target.decode([active], state), state)).toBe(false);
      resolve([bench]);
      const choice = cardChoice();
      expect(choice.validate(choice.decode([cardIndex(choice, grass)]))).toBe(false);
      chooseCard('Murkrow PAL');
      animate();
      expect(player1.bench[0].getPokemonCard()?.fullName).toBe('Murkrow PAL');
      expect(player1.discard.cards.some(card => card.fullName === dark)).toBe(true);
      store.cleanup();
    }
  });

  it('inherits a card-bound delayed Knock Out and clears it from the outgoing card', () => {
    const thorton = 'Thorton LOR';
    const { player1, state } = start({
      active: { card: dark }, bench: [{ card: 'Murkrow PAL' }], hand: [thorton], discard: [grass],
    });
    const outgoing = player1.active.getPokemonCard()!;
    outgoing.knockOutAtEndOfTurnPlayerId = player1.id;
    playTrainerCard(store, state, 0, thorton);
    animate();
    resolve([active]);
    chooseCard(grass);
    animate();
    const incoming = player1.active.getPokemonCard()!;
    expect(incoming.fullName).toBe(grass);
    expect(incoming.knockOutAtEndOfTurnPlayerId).toBe(player1.id);
    expect(outgoing.knockOutAtEndOfTurnPlayerId).toBeUndefined();
    store.dispatch(new PassTurnAction(player1.id));
    animate();
    expect(player1.discard.cards).toContain(incoming);
  });
});
