import {
  Card, CardList, CardManager, ChooseCardsPrompt, GameMessage, GamePhase, Player, PlayerType,
  PlayCardAction, ResolvePromptAction, ShowCardsPrompt, SlotType, State, Store,
} from '../../game';
import { CardZone, SandboxModifyCardAction } from '../../game/store/actions/sandbox-modify-card-action';
import { CopiedSupporterEffect } from '../../game/store/effects/play-card-effects';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { MOVE_HAND_TO_DECK_THEN_DRAW } from '../../game/store/prefabs/prefabs';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { HolonFarmer } from '../set-ex-delta-species/holon-farmer';
import { Charmander } from '../set-base-set/charmander';
import { Charmeleon } from '../set-base-set/charmeleon';
import { Squirtle } from '../set-base-set/squirtle';
import { EmpoleonLVX } from '../set-diamond-and-pearl/empoleon-lvx';
import { GrassEnergy } from '../set-scarlet-and-violet-energy/grass-energy';
import { FireEnergy } from '../set-scarlet-and-violet-energy/fire-energy';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { LuminousEnergy } from '../set-paldea-evolved/luminous-energy';
import { VolcanionPrismStar } from '../set-forbidden-light/volcanion-prism-star';
import { Switch } from '../set-scarlet-and-violet/switch';

beforeAll(() => {
  CardManager.getInstance().defineSet([new FireEnergy(), new WaterEnergy()]);
});

function setup() {
  const state = new State();
  const player = new Player();
  const opponent = new Player();
  player.id = 1;
  opponent.id = 2;
  player.active.cards = [new Charmander()];
  opponent.active.cards = [new Squirtle()];
  state.players = [player, opponent];
  state.activePlayer = 0;
  state.turn = 3;
  state.phase = GamePhase.PLAYER_TURN;
  state.gameSettings.sandboxMode = true;
  const store = new Store({ onStateChange: () => undefined });
  store.state = state;
  const pending = <T>(type: new (...args: any[]) => T) =>
    state.prompts.find(prompt => prompt instanceof type && prompt.result === undefined) as T | undefined;
  const resolve = <T>(prompt: { id: number }, result: T) =>
    (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, result));
  const play = () => store.dispatch(new PlayCardAction(player.id, 0, {
    player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0,
  }));
  const remove = (card: Card, zone: CardZone) => store.dispatch(new SandboxModifyCardAction(
    player.id, player.id, 'remove', card.fullName, zone
  ), 4);
  return { state, store, player, opponent, pending, resolve, play, remove };
}

describe('MoveCardsEffect deck order', () => {
  it('places selected cards on top once each, excluding missing cards', () => {
    const x = setup();
    const fire = new FireEnergy(), grass = new GrassEnergy(), water = new WaterEnergy();
    x.player.deck.cards = [grass];
    x.player.discard.cards = [fire];
    x.store.reduceEffect(x.state, new MoveCardsEffect(x.player.discard, x.player.deck, {
      cards: [water, fire, fire], toTop: true,
    }));
    expect(x.player.deck.cards).toEqual([fire, grass]);
    expect(x.player.discard.cards).toEqual([]);
  });

  it('preserves the old deck when putting selected hand cards on the bottom', () => {
    const x = setup();
    const fire = new FireEnergy(), grass = new GrassEnergy(), water = new WaterEnergy();
    x.player.deck.cards = [grass, water];
    x.player.hand.cards = [fire];
    MOVE_HAND_TO_DECK_THEN_DRAW(x.store, x.state, x.player, { cards: [fire], drawCount: 1 });
    expect(x.player.hand.cards).toEqual([grass]);
    expect(x.player.deck.cards).toEqual([water, fire]);
  });

  it('moves a counted prefix in order without affecting either remainder', () => {
    const x = setup();
    const fire = new FireEnergy(), grass = new GrassEnergy(), water = new WaterEnergy();
    x.player.discard.cards = [water, fire];
    x.player.deck.cards = [grass];
    x.store.reduceEffect(x.state, new MoveCardsEffect(x.player.discard, x.player.deck, { count: 1, toTop: true }));
    expect(x.player.discard.cards).toEqual([fire]);
    expect(x.player.deck.cards).toEqual([water, grass]);
  });

  it('empties a whole list moved to the top while keeping a previously shown group intact', () => {
    const x = setup();
    const top = new CardList();
    top.cards = [new FireEnergy(), new GrassEnergy()];
    const shown = top.cards;
    const oldTop = new WaterEnergy();
    x.player.deck.cards = [oldTop];
    x.store.reduceEffect(x.state, new MoveCardsEffect(top, x.player.deck, { toTop: true }));
    expect(top.cards).toEqual([]);
    expect(shown.length).toBe(2);
    expect(x.player.deck.cards).toEqual([...shown, oldTop]);
  });

  it('keeps redirected Prism Star cards out of a reordered discard pile', () => {
    const x = setup();
    const prism = new VolcanionPrismStar(), fire = new FireEnergy(), water = new WaterEnergy();
    x.player.hand.cards = [prism, fire];
    x.player.discard.cards = [water];
    x.store.reduceEffect(x.state, new MoveCardsEffect(x.player.hand, x.player.discard, { toTop: true }));
    expect(x.player.discard.cards).toEqual([fire, water]);
    expect(x.player.lostzone.cards).toEqual([prism]);
    expect(x.player.hand.cards).toEqual([]);
  });
});

describe('Holon Farmer DS', () => {
  it('waits for the payment, then offers the newly discarded card and each available type', () => {
    const x = setup();
    const farmer = new HolonFarmer(), fire = new FireEnergy(), water = new WaterEnergy();
    const pkm = new Charmeleon(), special = new LuminousEnergy();
    x.player.hand.cards = [farmer, fire, special];
    x.player.discard.cards = [pkm];
    x.player.deck.cards = [water];
    x.play();
    const cost = x.pending(ChooseCardsPrompt)!;
    expect(cost.message).toBe(GameMessage.CHOOSE_CARD_TO_DISCARD);
    expect(cost.cards.cards).toEqual([fire, special]);
    expect(x.player.supportersPlayedThisTurn ?? 0).toBe(0);
    x.resolve(cost, [fire]);
    const recover = x.pending(ChooseCardsPrompt)!;
    expect(recover.message).toBe(GameMessage.CHOOSE_CARD_TO_DECK);
    expect(recover.options.min).toBe(2);
    expect(recover.validate([pkm, fire])).toBe(true);
    expect(x.player.supporter.cards).toEqual([farmer]);
    expect(x.player.supportersPlayedThisTurn).toBe(1);
    x.resolve(recover, [pkm, fire]);
    const reveal = x.pending(ShowCardsPrompt)!;
    expect(reveal.playerId).toBe(x.opponent.id);
    expect(reveal.cards).toEqual([pkm, fire]);
    expect(x.player.discard.cards).toEqual([pkm, fire]);
    expect(x.pending(ShuffleDeckPrompt)).toBeUndefined();
    x.resolve(reveal, true);
    expect(x.player.deck.cards).toEqual([pkm, fire, water]);
    x.resolve(x.pending(ShuffleDeckPrompt)!, [2, 1, 0]);
    expect(x.player.deck.cards).toEqual([water, fire, pkm]);
    expect(x.player.discard.cards).toEqual([farmer]);
  });

  it('can pay with the only recoverable card when the discard pile starts empty', () => {
    const x = setup();
    const farmer = new HolonFarmer(), fire = new FireEnergy();
    x.player.hand.cards = [farmer, fire, new Switch()];
    x.play();
    const recover = x.pending(ChooseCardsPrompt)!;
    expect(recover.message).toBe(GameMessage.CHOOSE_CARD_TO_DECK);
    expect(recover.validate([fire])).toBe(true);
    expect(x.player.discard.cards).toEqual([fire]);
  });

  it('rejects a play with no other card in hand and leaves the allowance unchanged', () => {
    const x = setup();
    const farmer = new HolonFarmer();
    x.player.hand.cards = [farmer];
    x.player.discard.cards = [new FireEnergy()];
    x.player.coinFlipCancelTrainerPlayTurnsRemaining = 1;
    expect(x.play).toThrow();
    expect(x.player.hand.cards).toEqual([farmer]);
    expect(x.player.supportersPlayedThisTurn ?? 0).toBe(0);
    expect(x.store.hasPrompts()).toBe(false);
  });

  it('accepts Pokémon LV.X, requires three of each available type and excludes Special Energy', () => {
    const x = setup();
    const pokemon = [new Charmander(), new Charmeleon(), new EmpoleonLVX(), new Squirtle()];
    const energies = [new FireEnergy(), new WaterEnergy(), new GrassEnergy(), new FireEnergy()];
    const special = new LuminousEnergy();
    x.player.hand.cards = [new HolonFarmer(), new Switch()];
    x.player.discard.cards = [...pokemon, ...energies, special];
    x.play();
    const recover = x.pending(ChooseCardsPrompt)!;
    expect(recover.options.min).toBe(6);
    expect(recover.validate([...pokemon.slice(0, 3), ...energies.slice(0, 3)])).toBe(true);
    expect(recover.validate([...pokemon, ...energies.slice(0, 2)])).toBe(false);
    expect(recover.validate([...pokemon.slice(0, 3), ...energies.slice(0, 2), special])).toBe(false);
    expect(recover.validate([...pokemon.slice(0, 2), ...energies.slice(0, 3)])).toBe(false);
  });

  it('counts a Prism Star as paid while recovering only from the discard pile', () => {
    const x = setup();
    const farmer = new HolonFarmer(), prism = new VolcanionPrismStar(), fire = new FireEnergy();
    x.player.hand.cards = [farmer, prism];
    x.player.discard.cards = [fire];
    x.play();
    expect(x.player.lostzone.cards).toEqual([prism]);
    expect(x.pending(ChooseCardsPrompt)!.cards.cards).toEqual([fire]);
    expect(x.player.supportersPlayedThisTurn).toBe(1);
  });

  it('rechecks a pending payment after sandbox edits and leaves an unpayable Farmer in hand', () => {
    const x = setup();
    const farmer = new HolonFarmer(), fire = new FireEnergy(), water = new WaterEnergy();
    x.player.hand.cards = [farmer, fire, water];
    x.play();
    const original = x.pending(ChooseCardsPrompt)!;
    x.remove(fire, CardZone.HAND);
    x.resolve(original, [fire]);
    const replacement = x.pending(ChooseCardsPrompt)!;
    expect(replacement.cards.cards).toEqual([water]);
    x.remove(water, CardZone.HAND);
    x.resolve(replacement, [water]);
    expect(x.player.hand.cards).toEqual([farmer]);
    expect(x.player.supportersPlayedThisTurn ?? 0).toBe(0);
    expect(x.store.hasPrompts()).toBe(false);
  });

  it('resolves a borrowed Farmer against the copying player’s hand and discard', () => {
    const x = setup();
    const farmer = new HolonFarmer(), fire = new FireEnergy(), water = new WaterEnergy();
    x.opponent.hand.cards = [farmer];
    x.player.hand.cards = [fire, water];
    x.player.supportersPlayedThisTurn = 1;
    x.player.supporterTurn = 1;
    x.store.reduceEffect(x.state, new CopiedSupporterEffect(x.player, farmer));
    x.resolve(x.pending(ChooseCardsPrompt)!, [water]);
    x.resolve(x.pending(ChooseCardsPrompt)!, [water]);
    x.resolve(x.pending(ShowCardsPrompt)!, true);
    x.resolve(x.pending(ShuffleDeckPrompt)!, [0]);
    expect(x.player.hand.cards).toEqual([fire]);
    expect(x.player.deck.cards).toEqual([water]);
    expect(x.opponent.hand.cards).toEqual([farmer]);
    expect(x.player.supportersPlayedThisTurn).toBe(1);
    expect(x.player.supporterTurn).toBe(1);
  });
});
