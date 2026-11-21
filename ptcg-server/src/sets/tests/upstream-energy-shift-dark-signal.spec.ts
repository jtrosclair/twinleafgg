import { ensureClientCards } from '../../client/cards';
import { GameMessage } from '../../game/game-message';
import { compactSerializedState } from '../../game/serializer/compact-state';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { CardType, SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const active: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench: CardTarget = { ...active, slot: SlotType.BENCH };
const opposingBench: CardTarget = { ...bench, player: PlayerType.TOP_PLAYER };
const electrode = 'Electrode SW';
const blissey = 'Blissey V CRE';
const pikachu = 'Pikachu ex SSP';
const lightning = 'Lightning Energy SVE';
const psychic = 'Psychic Energy SVE';
const fire = 'Fire Energy SVE';
const balloon = 'Air Balloon SSH';
const umbreon = 'Umbreon VMAX EVS';

beforeAll(ensureClientCards);

let store: Store;
afterEach(() => store?.cleanup());

function start(left: PlayerConfig, right: PlayerConfig) {
  const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...left }, player2: { deck: padDeck(8), ...right } });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected a prompt');
  const decoded = prompt.decode(raw, store.state);
  if (!prompt.validate(decoded, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
  store.dispatch(new ResolvePromptAction(prompt.id, decoded));
}

function animations() {
  while (pending() instanceof WaitPrompt) resolve(true);
}

function attack(name: string) {
  store.dispatch(new AttackAction(store.state.players[store.state.activePlayer].id, name));
  animations();
}

function expectPromotion(playerId: number) {
  const prompt = pending();
  expect(prompt?.playerId).toBe(playerId);
  expect(prompt instanceof ChoosePokemonPrompt && prompt.message).toBe(GameMessage.CHOOSE_NEW_ACTIVE_POKEMON);
}

describe('Energy Shift and Ion Blast', () => {
  it('attaches after lethal opposing damage, promotes before the Prize, and saves the original Energy card', () => {
    const { player1, player2, state } = start({ active: { card: blissey, energy: [fire, fire, fire] } }, {
      active: { card: electrode, energy: [lightning], tools: [balloon] }, bench: [{ card: pikachu }],
      deck: ['Voltorb BS', ...padDeck(8)],
    });
    const card = player2.active.getPokemonCard()!;
    const voltorb = player2.deck.cards.shift()!;
    player2.active.cards.unshift(voltorb);
    attack('Blissful Blast');
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    expect(pending()?.playerId).toBe(player2.id);
    expect(player1.getPrizeLeft()).toBe(6);
    resolve(true);
    expect(() => resolve([active])).toThrow();
    resolve([bench]);
    expect(player2.bench[0].energies.cards).toEqual([card]);
    expect(player2.bench[0].cards.filter(item => item === card)).toEqual([card]);
    expect(player2.discard.cards.map(item => item.fullName)).toEqual(jasmine.arrayWithExactContents(['Voltorb BS', lightning, balloon]));
    expectPromotion(player2.id);
    expect(player1.getPrizeLeft()).toBe(6);
    resolve([bench]);
    animations();
    expect(player2.active.getPokemonCard()?.fullName).toBe(pikachu);
    expect(player1.getPrizeLeft()).toBe(5);

    const cards = [...new Set(state.players.flatMap(owner => [owner.active, ...owner.bench, owner.deck,
      owner.hand, owner.discard, owner.lostzone, ...owner.prizes].flatMap(zone => zone.cards)))];
    cards.forEach((item, index) => { item.id = index; });
    state.cardNames = cards.map(item => item.fullName);
    const serializer = new StateSerializer();
    const snapshot = serializer.serialize(state);
    const restored = serializer.deserialize(compactSerializedState(snapshot));
    expect(serializer.serialize(restored)).toEqual(snapshot);
    const owner = restored.players[1];
    const restoredCard = owner.active.energies.cards[0];
    expect(restoredCard.superType).toBe(SuperType.ENERGY);
    expect(owner.active.cards.find(item => item.id === card.id)).toBe(restoredCard);
    const provided = new CheckProvidedEnergyEffect(owner, owner.active);
    store.reduceEffect(restored, provided);
    expect(provided.energyMap).toEqual([{ card: restoredCard, provides: [CardType.ANY] }]);
    expect(StateUtils.checkEnoughEnergy(provided.energyMap, [CardType.WATER])).toBe(true);
    expect(StateUtils.checkEnoughEnergy(provided.energyMap, [CardType.WATER, CardType.LIGHTNING])).toBe(false);
    owner.active.moveCardTo(restoredCard, owner.discard);
    expect(restoredCard.superType).toBe(SuperType.POKEMON);
  });

  it('offers Energy Shift after Ion Blast recoil and settles both Active Knock Outs in turn order', () => {
    const { player1, player2 } = start({ active: { card: electrode, energy: [lightning, fire] }, bench: [{ card: pikachu }] },
      { active: { card: blissey, damage: 150 }, bench: [{ card: pikachu }] });
    attack('Ion Blast');
    resolve(true);
    animations();
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    expect(player2.active.damage).toBe(250);
    expect(player1.active.damage).toBe(100);
    resolve(true);
    resolve([bench]);
    expectPromotion(player2.id);
    resolve([bench]);
    expectPromotion(player1.id);
    expect(player2.getPrizeLeft()).toBe(6);
    resolve([bench]);
    animations();
    expect(player2.getPrizeLeft()).toBe(5);
    expect(player1.getPrizeLeft()).toBe(4);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([electrode]);
  });

  it('routes the rest of the stack to the Lost Zone when Darkness Lost causes the Knock Out', () => {
    const { player1, player2 } = start({ active: { card: 'Giratina LV.X PL', energy: [psychic, psychic, fire, fire] } },
      { active: { card: electrode, damage: 60, energy: [lightning], tools: [balloon] },
        bench: [{ card: pikachu }], deck: ['Voltorb BS', ...padDeck(8)] });
    player2.active.cards.unshift(player2.deck.cards.shift()!);
    attack('Darkness Lost');
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    resolve([bench]);
    expect(player2.lostzone.cards.map(card => card.fullName)).toEqual(jasmine.arrayWithExactContents(['Voltorb BS', lightning, balloon]));
    expect(player2.bench[0].energies.cards.map(card => card.fullName)).toEqual([electrode]);
    expect(player2.discard.cards).toEqual([]);
    expectPromotion(player2.id);
    resolve([bench]);
    animations();
    expect(player1.getPrizeLeft()).toBe(5);
  });

  it('awards the Prize at the usual point when the player declines Energy Shift', () => {
    const { player1, player2 } = start({ active: { card: blissey, energy: [fire, fire, fire] } },
      { active: { card: electrode }, bench: [{ card: pikachu }] });
    attack('Blissful Blast');
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expectPromotion(player2.id);
    expect(player1.getPrizeLeft()).toBe(5);
    expect(player2.discard.cards.map(card => card.fullName)).toEqual([electrode]);
  });

  it('skips Energy Shift when the only other Pokémon is also Knocked Out', () => {
    const { player1, player2 } = start({ active: { card: 'Giratina LV.X PL', energy: [psychic, psychic, fire, fire] } },
      { active: { card: electrode, damage: 60 }, bench: [{ card: 'Uxie SSP', damage: 50 }] });
    attack('Darkness Lost');
    expect(pending()).toBeUndefined();
    expect(player2.lostzone.cards.map(card => card.fullName)).toEqual(jasmine.arrayWithExactContents([electrode, 'Uxie SSP']));
    expect(player1.getPrizeLeft()).toBe(4);
  });

  it('does not offer Energy Shift after an attack that places damage counters', () => {
    const { player1, player2 } = start({ active: { card: 'Uxie SSP', energy: [psychic] } },
      { active: { card: electrode, damage: 60 }, bench: [{ card: pikachu }] });
    player2.marker.addMarkerToState(player2.DAMAGE_DEALT_MARKER);
    attack('Painful Memories');
    expectPromotion(player2.id);
    expect(player1.getPrizeLeft()).toBe(5);
    expect(player2.discard.cards.map(card => card.fullName)).toEqual([electrode]);
  });

  it('does not offer Energy Shift when Poison causes a Knock Out during checkup', () => {
    const { player1, player2 } = start({ active: { card: electrode, damage: 70 }, bench: [{ card: pikachu }] }, { active: { card: blissey } });
    player1.active.addSpecialCondition(SpecialCondition.POISONED);
    store.dispatch(new PassTurnAction(player1.id));
    animations();
    expectPromotion(player1.id);
    expect(player2.getPrizeLeft()).toBe(5);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([electrode]);
  });

  it('honors Chilly Breath when Ion Blast Knocks Out Electrode and Glaceon at the same time', () => {
    const { player1, player2 } = start({ active: { card: electrode, energy: [lightning, fire] }, bench: [{ card: pikachu }] },
      { active: { card: 'Glaceon LV.X MD' }, bench: [{ card: pikachu }] });
    attack('Ion Blast');
    resolve(true);
    animations();
    expectPromotion(player2.id);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(electrode);
    expect(player2.getPrizeLeft()).toBe(5);
  });

  it('does 40 damage without recoil when Ion Blast’s bonus is declined', () => {
    const { player1, player2 } = start({ active: { card: electrode, energy: [lightning, fire] } }, { active: { card: blissey } });
    attack('Ion Blast');
    resolve(false);
    animations();
    expect(player1.active.damage).toBe(0);
    expect(player2.active.damage).toBe(40);
    expect(player2.getPrizeLeft()).toBe(6);
  });
});

describe('Dark Signal', () => {
  for (const [base, print] of [['Umbreon V EVS', umbreon], ['Umbreon V BRS', 'Umbreon VMAX BRS'],
    ['Umbreon V EVS', 'Umbreon VMAX (EVS 214)'], ['Umbreon V EVS', 'Umbreon VMAX (EVS 215)']]) {
    it(`${print} evolves with no Dark Signal prompt against an empty Bench`, () => {
      const { player1 } = start({ active: { card: base }, hand: [print] }, { active: { card: blissey } });
      store.dispatch(new PlayCardAction(player1.id, 0, active));
      expect(player1.active.getPokemonCard()?.fullName).toBe(print);
      expect(pending()).toBeUndefined();
    });
  }

  for (const target of [pikachu, 'Corviknight VMAX BST']) {
    it(`allows selecting ${target} and applies its opposing Ability protection`, () => {
      const { player1, player2 } = start({ active: { card: blissey }, bench: [{ card: 'Umbreon V EVS' }], hand: [umbreon] },
        { active: { card: blissey }, bench: [{ card: target }] });
      store.dispatch(new PlayCardAction(player1.id, 0, bench));
      expect(pending() instanceof ConfirmPrompt).toBe(true);
      resolve(true);
      resolve([opposingBench]);
      expect(player2.active.getPokemonCard()?.fullName).toBe(target === pikachu ? target : blissey);
      expect(pending()).toBeUndefined();
      expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Dark Signal', bench))).toThrow();
    });
  }

  it('allows Dark Signal to be declined after a legal evolution', () => {
    const { player1, player2 } = start({ active: { card: 'Umbreon V EVS' }, hand: [umbreon] },
      { active: { card: blissey }, bench: [{ card: pikachu }] });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    resolve(false);
    expect(player1.active.getPokemonCard()?.fullName).toBe(umbreon);
    expect(player2.active.getPokemonCard()?.fullName).toBe(blissey);
    expect(pending()).toBeUndefined();
  });

  it('does not offer Dark Signal when Path to the Peak suppresses the evolved Pokémon', () => {
    const { player1 } = start({ active: { card: 'Umbreon V EVS' }, hand: [umbreon] },
      { active: { card: blissey }, bench: [{ card: pikachu }] });
    player1.stadium.cards.push(getCardByName('Path to the Peak CRE'));
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(player1.active.getPokemonCard()?.fullName).toBe(umbreon);
    expect(pending()).toBeUndefined();
  });

  it('rejects playing Umbreon VMAX onto the opposing player’s Umbreon V', () => {
    const { player1, player2 } = start({ active: { card: blissey }, hand: [umbreon] },
      { active: { card: 'Umbreon V EVS' }, bench: [{ card: pikachu }] });
    const opposingActive: CardTarget = { ...active, player: PlayerType.TOP_PLAYER };
    expect(() => store.dispatch(new PlayCardAction(player1.id, 0, opposingActive))).toThrow();
    expect(player1.hand.cards[0]?.fullName).toBe(umbreon);
    expect(player2.active.getPokemonCard()?.fullName).toBe('Umbreon V EVS');
    expect(pending()).toBeUndefined();
  });

  it('rejects placing a Basic Pokémon from hand onto an opposing empty Bench slot', () => {
    const { player1, player2 } = start({ active: { card: blissey }, hand: [pikachu] }, { active: { card: blissey } });
    expect(() => store.dispatch(new PlayCardAction(player1.id, 0, opposingBench))).toThrow();
    expect(player1.hand.cards[0]?.fullName).toBe(pikachu);
    expect(player2.bench[0].getPokemonCard()).toBeUndefined();
  });

  it('does not offer Dark Signal after an evolution from the deck', () => {
    const { player1, state } = start({ active: { card: 'Umbreon V EVS' }, deck: [umbreon, ...padDeck(8)] },
      { active: { card: blissey }, bench: [{ card: pikachu }] });
    const evolution = player1.deck.cards[0];
    if (!(evolution instanceof PokemonCard)) throw new Error('Expected Umbreon VMAX');
    store.reduceEffect(state, new EvolveEffect(player1, player1.active, evolution, player1.deck));
    expect(player1.active.getPokemonCard()?.fullName).toBe(umbreon);
    expect(pending()).toBeUndefined();
  });
});
