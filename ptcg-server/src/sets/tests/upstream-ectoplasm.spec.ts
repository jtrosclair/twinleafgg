import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { AttackAction, PassTurnAction, UseAbilityAction, UseStadiumAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Card } from '../../game/store/card/card';
import { SpecialCondition } from '../../game/store/card/card-types';
import { CAN_PLAY_POKEMON_CARD, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { checkState } from '../../game/store/effect-reducers/check-effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { Store } from '../../game/store/store';
import { padDeck, setupGame, SetupGameConfig } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const board = { ...active, slot: SlotType.BOARD };
const lastLevel = 'Dusknoir SF';
const lvx = 'Dusknoir LV.X SF';
const arceus = 'Arceus V BRS';
const giratina = 'Giratina LV.X PL';
const mew = 'Mew ex MEW';
const fire = 'Fire Energy SVE';
const psychic = 'Psychic Energy SVE';
const swell = 'Chaotic Swell CEC';
const crystal = 'Cessation Crystal CG';
const court = 'Training Court RCL';

beforeAll(ensureClientCards);

describe('Dusknoir LV.X and Ectoplasm', () => {
  let store: Store;
  afterEach(() => store?.cleanup());

  function start(left: SetupGameConfig['player1'], right: SetupGameConfig['player2'], turn = 5) {
    const game = setupGame({ turn, player1: { deck: padDeck(8), ...left }, player2: { deck: padDeck(8), ...right } });
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    game.store.cleanup();
    return game;
  }

  function card(name: string, id = 1000): Card {
    const instance = CardManager.getInstance().getCardByName(name);
    if (!instance) throw new Error(`Missing ${name}`);
    instance.id = id;
    return instance;
  }

  function pending() {
    return store.state.prompts.find(prompt => prompt.result === undefined);
  }

  function resolve(raw: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('Expected a pending prompt');
    const decoded = prompt.decode(raw, store.state);
    if (!prompt.validate(decoded, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
    store.dispatch(new ResolvePromptAction(prompt.id, decoded));
  }

  function attack(name: string) {
    store.dispatch(new AttackAction(store.state.players[0].id, name));
    if (pending() instanceof WaitPrompt) resolve(true);
  }

  function knockedOut(stadium?: string, tool?: string, lost = false) {
    const { player1, player2 } = start({
      active: { card: lost ? giratina : arceus, energy: [psychic, psychic, fire, fire] },
      bench: [{ card: mew }],
    }, {
      active: { card: lvx, damage: lost ? 110 : 30, energy: [fire], tools: tool ? [tool] : [] },
      bench: [{ card: mew }],
    });
    const base = card(lastLevel);
    player2.active.cards.unshift(base);
    if (stadium) player1.stadium.cards.push(card(stadium, 1001));
    const top = player2.active.getPokemonCard()!;
    attack(lost ? 'Darkness Lost' : 'Power Edge');
    return { player1, player2, top, base };
  }

  it('keeps damage and attachments while clearing Special Conditions and effects when the Active Levels Up', () => {
    const { player1 } = start({ active: { card: lastLevel, damage: 30, energy: [psychic] }, hand: [lvx] }, { active: { card: mew } });
    player1.active.addSpecialCondition(SpecialCondition.POISONED);
    player1.active.cannotUseAttacksNextTurn.push('Night Spin');
    const top = player1.hand.cards[0] as PokemonCard;
    expect(CAN_PLAY_POKEMON_CARD(store, store.state, player1, top)).toBe(true);
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(player1.active.getPokemonCard()).toBe(top);
    expect(StateUtils.getPreviousLevel(player1.active)?.fullName).toBe(lastLevel);
    expect(top.hp).toBe(140);
    expect(player1.active.damage).toBe(30);
    expect(player1.active.specialConditions).not.toContain(SpecialCondition.POISONED);
    expect(player1.active.energies.cards[0].fullName).toBe(psychic);
    expect(player1.active.cannotUseAttacksNextTurn).toEqual([]);
  });

  it('cannot Level Up a Benched Pokémon', () => {
    const { player1 } = start({ active: { card: mew }, bench: [{ card: lastLevel }], hand: [lvx] }, { active: { card: mew } });
    expect(CAN_PLAY_POKEMON_CARD(store, store.state, player1, player1.hand.cards[0] as PokemonCard)).toBe(false);
    expect(() => store.dispatch(new PlayCardAction(player1.id, 0, bench))).toThrow();
    expect(store.state.players[0].hand.cards[0].fullName).toBe(lvx);
  });

  for (const turn of [1, 2, 5]) {
    it(`rejects Level Up during a first turn or if the Pokémon was played this turn (${turn})`, () => {
      const { player1 } = start({ active: { card: lastLevel }, hand: [lvx] }, { active: { card: mew } }, turn);
      player1.canEvolve = true;
      if (turn === 5) player1.active.pokemonPlayedTurn = turn;
      expect(CAN_PLAY_POKEMON_CARD(store, store.state, player1, player1.hand.cards[0] as PokemonCard)).toBe(false);
      expect(() => store.dispatch(new PlayCardAction(player1.id, 0, active))).toThrow();
    });
  }

  it('can actually use the previous Level’s Shadow Command and Damage Even', () => {
    const { player1, player2 } = start({ active: { card: lastLevel, energy: [psychic, fire], damage: 10 }, hand: [lvx] },
      { active: { card: mew } });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    store.dispatch(new UseAbilityAction(player1.id, 'Shadow Command', active));
    expect(player1.hand.cards.length).toBe(2);
    expect(player1.active.damage).toBe(30);
    expect(player1.active.getPokemonCard()?.powers.map(power => power.name)).toEqual(['Ectoplasm']);
    store.dispatch(new AttackAction(player1.id, 'Damage Even'));
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    resolve([{ ...active, player: PlayerType.TOP_PLAYER }]);
    if (pending() instanceof WaitPrompt) resolve(true);
    expect(player2.active.damage).toBe(30);
  });

  it('accepts Ectoplasm before awarding the Prize, replaces Chaotic Swell and ticks only on its opponent', () => {
    const { player1, player2, top, base } = knockedOut(swell, 'Air Balloon SSH');
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    expect(pending()?.playerId).toBe(player2.id);
    expect(player1.getPrizeLeft()).toBe(6);
    resolve(true);
    expect(StateUtils.getStadiumCard(store.state)).toBe(top);
    expect(player1.discard.cards.map(c => c.fullName)).toContain(swell);
    expect(player2.discard.cards).toContain(base);
    expect(player2.discard.cards.map(c => c.fullName)).toEqual(jasmine.arrayContaining([fire, 'Air Balloon SSH']));
    expect(player1.getPrizeLeft()).toBe(5);
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    resolve([bench]);
    expect(player1.active.damage).toBe(10);
    expect(player1.bench[0].damage).toBe(10);
    expect(player2.active.damage).toBe(0);
    expect(pending()).toBeUndefined();
  });

  it('declining leaves a normal Knock Out and awards exactly one Prize', () => {
    const { player1, player2, top, base } = knockedOut(swell);
    resolve(false);
    expect(StateUtils.getStadiumCard(store.state)?.fullName).toBe(swell);
    expect(player2.discard.cards).toContain(top);
    expect(player2.discard.cards).toContain(base);
    expect(player1.getPrizeLeft()).toBe(5);
  });

  it('keeps Dusknoir as the Stadium when Darkness Lost sends the rest of the stack to the Lost Zone', () => {
    const { player1, player2, top, base } = knockedOut(undefined, 'Air Balloon SSH', true);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    expect(player2.stadium.cards).toEqual([top]);
    expect(player2.lostzone.cards).toContain(base);
    expect(player2.lostzone.cards.map(c => c.fullName)).toEqual(jasmine.arrayContaining([fire, 'Air Balloon SSH']));
    expect(player2.lostzone.cards).not.toContain(top);
    expect(player1.getPrizeLeft()).toBe(5);
  });

  it('does not offer Ectoplasm when the Poké-Power is suppressed by Cessation Crystal', () => {
    const { player1, player2, top } = knockedOut(undefined, crystal);
    expect(pending() instanceof ConfirmPrompt).toBe(false);
    expect(player2.discard.cards).toContain(top);
    expect(player2.stadium.cards).toEqual([]);
    expect(player1.getPrizeLeft()).toBe(5);
  });

  it('does not turn a damage-counter or Bench Knock Out into a Stadium', () => {
    const { player1, player2 } = start({ active: { card: arceus } }, { active: { card: lvx, damage: 130 }, bench: [{ card: lvx, damage: 130 }] });
    const first = player2.active.getPokemonCard()!;
    const second = player2.bench[0].getPokemonCard()!;
    store.reduceEffect(store.state, new PlaceDamageCountersEffect(player1, player2.active, 10));
    store.reduceEffect(store.state, new PlaceDamageCountersEffect(player1, player2.bench[0], 10));
    checkState(store, store.state);
    expect(pending() instanceof ConfirmPrompt).toBe(false);
    expect(player2.discard.cards).toContain(first);
    expect(player2.discard.cards).toContain(second);
    expect(player2.stadium.cards).toEqual([]);
  });

  it('treats the Stadium counters separately from opposing Abilities and respects Stadium protection', () => {
    const { player1, player2 } = start({ active: { card: mew } }, {
      active: { card: 'Poltchageist M5', tools: [crystal] },
      bench: [{ card: 'Lunatone OBF' }, { card: 'Solrock PGO' }],
    });
    // The Crystal can block New Moon, so remove it before testing Stadium immunity.
    player2.active.moveCardTo(player2.active.tools[0], player2.discard);
    player1.stadium.cards.push(card(lvx));
    store.reduceEffect(store.state, new BetweenTurnsEffect(player2));
    expect(player2.active.damage).toBe(0);
    // New Moon protects the entire opposing side while Solrock is in play.
    store.reduceEffect(store.state, new BetweenTurnsEffect(player1));
    expect(player2.active.damage).toBe(0);
    player2.bench[1].moveTo(player2.discard);
    store.reduceEffect(store.state, new BetweenTurnsEffect(player1));
    expect(player2.active.damage).toBe(10);
    expect(player2.bench[0].damage).toBe(10);
    expect(player1.active.damage).toBe(0);
  });

  it('keeps the Stadium effect through Cessation Crystal after Ectoplasm entered play', () => {
    const { player1, player2 } = start({ active: { card: mew } }, { active: { card: mew, tools: [crystal] } });
    player1.stadium.cards.push(card(lvx));
    store.dispatch(new PassTurnAction(player1.id));
    expect(player2.active.damage).toBe(10);
  });

  it('returns the Stadium to its owner’s hand when a different Stadium replaces it', () => {
    const { player1, player2 } = start({ active: { card: mew }, hand: [court] }, { active: { card: mew } });
    const stadium = card(lvx);
    player2.stadium.cards.push(stadium);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(player2.hand.cards).toEqual([stadium]);
    expect(player2.discard.cards).toEqual([]);
    expect(StateUtils.getStadiumCard(store.state)?.fullName).toBe(court);
  });

  it('returns from an effect which discards the Stadium, even on an older saved board', () => {
    const { player1, player2 } = start({ active: { card: mew }, hand: ['Paint Roller AOR'] }, { active: { card: mew } });
    player2.stadium.cards.push(card(lvx));
    const physicalCards = store.state.players.flatMap(player =>
      [player.hand, player.deck, player.active, player.stadium, ...player.prizes].flatMap(list => list.cards));
    physicalCards.forEach((item, index) => { item.id = index; });
    store.state.cardNames = physicalCards.map(item => item.fullName);
    const serializer = new StateSerializer();
    store.state = serializer.deserialize(serializer.serialize(store.state));
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(store.state.players[1].hand.cards.map(c => c.fullName)).toEqual([lvx]);
    expect(StateUtils.getStadiumCard(store.state)).toBeUndefined();
  });

  it('returns to hand from a typed Stadium discard, with explicit Lost Zone moves kept distinct', () => {
    const { player1 } = start({ active: { card: mew } }, { active: { card: mew } });
    const stadium = card(lvx);
    player1.stadium.cards.push(stadium);
    MOVE_CARDS(store, store.state, player1.stadium, player1.discard, { cards: [stadium] });
    expect(player1.hand.cards).toEqual([stadium]);
    player1.hand.moveCardTo(stadium, player1.stadium);
    MOVE_CARDS(store, store.state, player1.stadium, player1.lostzone, { cards: [stadium] });
    expect(player1.lostzone.cards).toEqual([stadium]);
    expect(player1.hand.cards).toEqual([]);
  });

  it('plays a real Lost Vacuum with only a Stadium in play and puts it in the Lost Zone', () => {
    const { player1, player2 } = start({ active: { card: mew }, hand: ['Lost Vacuum LOR', fire] }, { active: { card: mew } });
    const stadium = card(lvx);
    player2.stadium.cards.push(stadium);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(player2.stadium.cards).toEqual([stadium]);
    expect(player2.lostzone.cards).toEqual([]);
    resolve([0]);
    expect(player1.lostzone.cards.map(item => item.fullName)).toEqual([fire]);
    expect(player2.lostzone.cards).toEqual([stadium]);
    expect(player2.hand.cards).toEqual([]);
  });

  it('rejects Lost Vacuum with no other hand card before changing the Stadium or opening a prompt', () => {
    const { player1, player2 } = start({ active: { card: mew }, hand: ['Lost Vacuum LOR'] }, { active: { card: mew } });
    player2.stadium.cards.push(card(lvx));
    expect(() => store.dispatch(new PlayCardAction(player1.id, 0, board))).toThrow();
    expect(StateUtils.getStadiumCard(store.state)?.fullName).toBe(lvx);
    expect(store.state.players[0].hand.cards[0].fullName).toBe('Lost Vacuum LOR');
    expect(pending()).toBeUndefined();
  });

  it('takes Lost Vacuum’s payment before choosing between the Stadium and a Tool', () => {
    const { player1, player2 } = start({ active: { card: mew }, hand: ['Lost Vacuum LOR', fire] },
      { active: { card: mew, tools: ['Air Balloon SSH'] } });
    const stadium = card(lvx);
    player2.stadium.cards.push(stadium);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(store.state.prompts.filter(prompt => prompt.result === undefined).length).toBe(1);
    resolve([0]);
    expect(player1.lostzone.cards[0].fullName).toBe(fire);
    resolve(0);
    resolve([{ ...active, player: PlayerType.TOP_PLAYER }]);
    expect(player2.lostzone.cards[0].fullName).toBe('Air Balloon SSH');
    expect(player2.stadium.cards).toEqual([stadium]);
    expect(player1.discard.cards[0].fullName).toBe('Lost Vacuum LOR');
  });

  it('cannot activate Ectoplasm manually from its Stadium position', () => {
    const { player1 } = start({ active: { card: mew } }, { active: { card: mew } });
    player1.stadium.cards.push(card(lvx));
    expect(() => store.dispatch(new UseStadiumAction(player1.id))).toThrow();
    expect(StateUtils.getStadiumCard(store.state)?.fullName).toBe(lvx);
  });

  it('applies one counter during each actual Checkup while staying in the Stadium zone', () => {
    const { player1, player2 } = start({ active: { card: mew } }, { active: { card: mew }, bench: [{ card: mew }] });
    player1.stadium.cards.push(card(lvx));
    store.dispatch(new PassTurnAction(player1.id));
    expect(player2.active.damage).toBe(10);
    store.dispatch(new PassTurnAction(player2.id));
    expect(player2.active.damage).toBe(20);
    expect(player2.bench[0].damage).toBe(20);
    expect(player1.active.damage).toBe(0);
  });
});
