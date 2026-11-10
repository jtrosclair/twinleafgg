import { Card } from '../../game/store/card/card';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { Base64 } from '../../utils/base64';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { PlayItemEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GrassEnergy } from '../set-scarlet-and-violet-energy/grass-energy';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { FireEnergy } from '../set-scarlet-and-violet-energy/fire-energy';
import { LuminousEnergy } from '../set-paldea-evolved/luminous-energy';
import { EnergySearchPro } from '../set-surging-sparks/energy-search-pro';
import { Parasect } from '../set-neo-revelation/parasect';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';

class Basic extends PokemonCard { public name = 'Fixture'; public fullName = 'Fixture TST'; public set = 'TST'; public hp = 100; }
class MoveBlocker extends Basic {
  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof MoveCardsEffect && effect.sourceCard instanceof EnergySearchPro) effect.preventDefault = true;
    return state;
  }
}
class MoveRedirector extends Basic {
  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof MoveCardsEffect && effect.sourceCard instanceof EnergySearchPro) effect.destination = state.players[0].lostzone;
    return state;
  }
}
function setup(noBasic = false) {
  const state = new State(), player = new Player(), opponent = new Player(), item = new EnergySearchPro();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2; state.phase = GamePhase.PLAYER_TURN; state.activePlayer = 0;
  player.active.cards = [new Basic()]; opponent.active.cards = [new Basic()];
  const grass = new GrassEnergy(), grass2 = new GrassEnergy(), water = new WaterEnergy(), fire = new FireEnergy(), luminous = new LuminousEnergy(), pokemon = new Basic();
  player.deck.cards = noBasic ? [luminous, pokemon] : [grass, water, grass2, fire, luminous, pokemon]; player.hand.cards = [item];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  const moveEffects: MoveCardsEffect[] = []; const reduce = store.reduceEffect.bind(store);
  spyOn(store, 'reduceEffect').and.callFake((s: State, e: any) => { if (e instanceof MoveCardsEffect) moveEffects.push(e); return reduce(s, e); });
  store.reduceEffect(state, new PlayItemEffect(player, item));
  return { state, store, player, opponent, item, grass, grass2, water, fire, luminous, pokemon, moveEffects };
}
function search(x: ReturnType<typeof setup>) { return x.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt; }
function select(x: ReturnType<typeof setup>, cards: Card[]) {
  const prompt = search(x), selected = prompt.decode(cards.map(c => x.player.deck.cards.indexOf(c)));
  expect(prompt.validate(selected)).toBe(true); if (!prompt.validate(selected)) throw new Error('Invalid test selection');
  (x.store as any).reducePrompt(x.state, new ResolvePromptAction(prompt.id, selected));
}
function shuffled(x: ReturnType<typeof setup>) { return x.state.prompts.find(p => p instanceof ShuffleDeckPrompt && p.result === undefined) as ShuffleDeckPrompt; }

describe('Energy Search Pro search, reveal and shuffle', () => {
  it('waits to shuffle until after selected Energy move and are shown', () => {
    const x = setup(); expect(shuffled(x)).toBeUndefined(); select(x, [x.grass, x.water, x.fire]);
    expect(x.player.hand.cards).toEqual([]);
    expect(x.player.deck.cards.length).toBe(6);
    expect(x.moveEffects.length).toBe(0);
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined) as ShowCardsPrompt;
    expect(show).toBeDefined(); expect(show.playerId).toBe(x.opponent.id); expect(show.cards).toEqual([x.grass, x.water, x.fire]);
    expect(shuffled(x)).toBeUndefined();
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(show.id, true));
    expect(x.player.hand.cards).toEqual([x.grass, x.water, x.fire]);
    expect(x.player.deck.cards.length).toBe(3);
    expect(x.player.deck.cards).toContain(x.grass2); expect(x.player.deck.cards).toContain(x.luminous); expect(x.player.deck.cards).toContain(x.pokemon);
    const shuffle = shuffled(x); expect(shuffle).toBeDefined();
    if (!shuffle) return;
    expect(shuffle.validate([2, 0, 1], x.state)).toBe(true);
    const remaining = x.player.deck.cards.slice();
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(shuffle.id, [2, 0, 1]));
    expect(x.player.deck.cards).toEqual([remaining[2], remaining[0], remaining[1]]);
  });
  it('permits finding zero basic Energy but still shuffles the deck', () => {
    const x = setup(); select(x, []); expect(x.player.hand.cards).toEqual([]); expect(shuffled(x)).toBeDefined();
    expect(x.state.prompts.some(p => p instanceof ShowCardsPrompt && p.result === undefined)).toBe(false);
    expect(x.moveEffects.length).toBe(0);
  });
  it('permits failing the private search when no basic Energy exists', () => {
    const x = setup(true); expect(search(x).options.max).toBe(0); select(x, []); expect(shuffled(x)).toBeDefined();
  });
  it('rejects two same-type Basic Energy and rejects Special Energy and Pokémon', () => {
    const x = setup(); expect(search(x).validate([x.grass, x.grass2])).toBe(false);
    expect(search(x).validate([x.grass, x.water, x.grass2])).toBe(false);
    expect(search(x).validate([x.luminous])).toBe(false); expect(search(x).validate([x.pokemon])).toBe(false);
    expect(search(x).validate([x.grass, x.water, x.fire])).toBe(true);
  });
  it('dispatches the selected cards via a source-attributed MoveCardsEffect', () => {
    const x = setup(); select(x, [x.water]);
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined)!;
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(show.id, true));
    const move = x.moveEffects.find(m => m.source === x.player.deck && m.destination === x.player.hand);
    expect(move).toBeDefined(); if (!move) return;
    expect(move.cards).toEqual([x.water]); expect(move.sourceCard).toBe(x.item);
  });
  it('keeps the Item in play until its reveal and shuffle prompts finish', () => {
    const x = setup(); select(x, [x.water]);
    expect(x.player.supporter.cards).toContain(x.item);
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined) as ShowCardsPrompt;
    expect(show).toBeDefined(); expect(shuffled(x)).toBeUndefined();
    if (!show) return;
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(show.id, true));
    expect(x.player.supporter.cards).toContain(x.item);
    const shuffle = shuffled(x); expect(shuffle).toBeDefined(); if (!shuffle) return;
    const order = x.player.deck.cards.map((_card, index) => index);
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(shuffle.id, order));
    expect(x.player.supporter.cards).not.toContain(x.item); expect(x.player.discard.cards).toContain(x.item);
  });
  it('rejects playing with an empty deck', () => {
    const state = new State(), player = new Player(), opponent = new Player(), item = new EnergySearchPro();
    player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.PLAYER_TURN;
    player.active.cards = [new Basic()]; opponent.active.cards = [new Basic()]; player.hand.cards = [item];
    const store = new Store({ onStateChange: () => undefined }); store.state = state;
    expect(() => store.reduceEffect(state, new PlayItemEffect(player, item))).toThrow();
  });

  it('resolves reveal before the automatic shuffle in the actual local simulator', () => {
    ensureClientCards();
    const state = new State(); state.phase = GamePhase.PLAYER_TURN; state.turn = 2;
    state.players = [new Player(), new Player()];
    const add = (list: CardList, name: string) => {
      const card = CardManager.getInstance().getCardByName(name)!;
      card.id = state.cardNames.length; state.cardNames.push(card.fullName); list.cards.push(card);
    };
    state.players.forEach((player, index) => {
      player.id = index + 1; player.name = index ? 'Dummy' : 'Player';
      player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
      player.prizes = Array.from({ length: 6 }, () => new CardList());
      player.prizes.forEach(prize => add(prize, 'Fire Energy SVE'));
      add(player.deck, 'Fire Energy SVE'); add(player.deck, 'Water Energy SVE');
      add(player.active, index ? 'Squirtle BS' : 'Charmander BS');
    });
    add(state.players[0].hand, 'Energy Search Pro SSP');
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(state)) });
    simulator.dispatch(new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
    const search = simulator.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
    expect(search).toBeDefined();
    const index = simulator.state.players[0].deck.cards.findIndex(card => card.name === 'Water Energy');
    expect(index).toBeGreaterThan(-1);
    const arbiter = (simulator as any).arbiter, resolve = arbiter.resolvePrompt.bind(arbiter), seen: string[] = [];
    spyOn(arbiter, 'resolvePrompt').and.callFake((s: State, prompt: any) => { seen.push(prompt.type); return resolve(s, prompt); });
    simulator.resolvePrompt(search.id, [index]);
    expect(seen.indexOf('Show cards')).toBeGreaterThan(-1);
    expect(seen.indexOf('Shuffle deck')).toBeGreaterThan(seen.indexOf('Show cards'));
    expect(simulator.state.players[0].hand.cards.some(card => card.name === 'Water Energy')).toBe(true);
    expect(simulator.state.players[0].discard.cards.some(card => card.name === 'Energy Search Pro')).toBe(true);
    expect(simulator.state.prompts.some(prompt => prompt.result === undefined)).toBe(false);
    simulator.cleanup();
  });

  it('works while a real Parasect N3 is in play', () => {
    const x = setup(); const slot = new PokemonCardList(); slot.cards = [new Parasect()]; x.player.bench.push(slot);
    expect(() => select(x, [x.water])).not.toThrow();
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined)!;
    expect(() => (x.store as any).reducePrompt(x.state, new ResolvePromptAction(show.id, true))).not.toThrow();
    expect(x.player.hand.cards).toContain(x.water);
    const move = x.moveEffects.find(m => m.source === x.player.deck && m.destination === x.player.hand);
    expect(move).toBeDefined(); expect(move?.sourceEffect instanceof TrainerEffect).toBe(true);
  });
  it('still reveals the searched card and shuffles when another effect prevents movement', () => {
    const x = setup(); const slot = new PokemonCardList(); slot.cards = [new MoveBlocker()]; x.opponent.bench.push(slot);
    select(x, [x.water]); expect(x.player.hand.cards).not.toContain(x.water); expect(x.player.deck.cards).toContain(x.water);
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined) as ShowCardsPrompt;
    expect(show).toBeDefined(); expect(show.cards).toEqual([x.water]); expect(shuffled(x)).toBeUndefined();
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(show.id, true)); expect(shuffled(x)).toBeDefined();
    expect(x.player.hand.cards).not.toContain(x.water); expect(x.player.deck.cards).toContain(x.water);
  });
  it('reveals before moving and preserves a redirected movement', () => {
    const x = setup(); const slot = new PokemonCardList(); slot.cards = [new MoveRedirector()]; x.opponent.bench.push(slot);
    select(x, [x.water]);
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined) as ShowCardsPrompt;
    expect(show.cards).toEqual([x.water]); expect(x.player.deck.cards).toContain(x.water); expect(x.player.lostzone.cards).not.toContain(x.water);
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(show.id, true));
    expect(x.player.hand.cards).not.toContain(x.water); expect(x.player.deck.cards).not.toContain(x.water); expect(x.player.lostzone.cards).toContain(x.water);
    expect(shuffled(x)).toBeDefined();
  });

});
