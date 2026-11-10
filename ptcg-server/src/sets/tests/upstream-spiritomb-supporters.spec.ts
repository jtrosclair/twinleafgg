import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { Base64 } from '../../utils/base64';
import { CardList } from '../../game/store/state/card-list';
import { AttackAction } from '../../game/store/actions/game-actions';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerType, Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect, MoveCardsEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { Spiritomb } from '../set-ultra-prism/spiritomb';
import { PokemonTower } from '../set-wotc-promos/pokemon-tower';
import { Parasect } from '../set-neo-revelation/parasect';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

class Basic extends PokemonCard { public name = 'Fixture'; public fullName = 'Fixture TST'; public set = 'TST'; public hp = 100; public stage = Stage.BASIC; }
class Supporter extends TrainerCard { public trainerType = TrainerType.SUPPORTER; public set = 'TST'; public name: string; public fullName: string; constructor(name: string) { super(); this.name = name; this.fullName = name + ' TST'; } }
class PsychicEnergy extends EnergyCard { public name = 'Psychic'; public fullName = 'Psychic TST'; public set = 'TST'; public provides = [CardType.PSYCHIC]; }
class Item extends TrainerCard { public trainerType = TrainerType.ITEM; public name = 'Item'; public fullName = 'Item TST'; public set = 'TST'; }
function setup(count: number) {
  const state = new State(), player = new Player(), opponent = new Player(), spiritomb = new Spiritomb();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.ATTACK; state.turn = 2;
  player.active.cards = [spiritomb]; opponent.active.cards = [new Basic()];
  const supporters = Array.from({ length: count }, (_, i) => new Supporter('Supporter ' + i));
  const item = new Item(); player.discard.cards = [...supporters, item];
  player.discard.cards.forEach((c, i) => c.id = i + 1);
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  const moves: MoveCardsEffect[] = [], reduce = store.reduceEffect.bind(store);
  spyOn(store, 'reduceEffect').and.callFake((s: State, e: any) => { if (e instanceof MoveCardsEffect) moves.push(e); return reduce(s, e); });
  store.reduceEffect(state, new AttackEffect(player, opponent, spiritomb.attacks[0]));
  const prompt = state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
  return { state, player, opponent, spiritomb, supporters, item, store, prompt, moves };
}

function setupCopied(tower: boolean, parasect = false) {
  clearCopyAttackSessionsForTests();
  const state = new State(), player = new Player(), opponent = new Player(), source = new Spiritomb(), mew = new Mewex();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2; state.phase = GamePhase.ATTACK;
  player.active.cards = [mew, new PsychicEnergy(), new PsychicEnergy(), new PsychicEnergy()]; opponent.active.cards = [new Basic()];
  const slot = new PokemonCardList(); slot.cards = [source]; player.bench = [slot];
  if (tower) opponent.stadium.cards = [new PokemonTower()];
  if (parasect) { const slot = new PokemonCardList(); slot.cards = [new Parasect()]; opponent.bench.push(slot); }
  const supporters = [new Supporter('Supporter 0'), new Supporter('Supporter 1')];
  player.discard.cards = supporters.slice(); player.discard.cards.forEach((c, i) => c.id = i + 1);
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  const moves: MoveCardsEffect[] = [], reduce = store.reduceEffect.bind(store);
  spyOn(store, 'reduceEffect').and.callFake((s: State, e: any) => { if (e instanceof MoveCardsEffect) moves.push(e); return reduce(s, e); });
  store.reduceEffect(state, new PowerEffect(player, mew.powers[0], mew));
  let prompt = state.prompts.filter(p => p.result === undefined).pop()!;
  (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, source.attacks[0]));
  prompt = state.prompts.filter(p => p.result === undefined).pop()!;
  if (!(prompt instanceof ChooseCardsPrompt)) {
    state.phase = GamePhase.FINISHED;
    (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, null));
    state.activePlayer = 0; state.phase = GamePhase.ATTACK;
  }
  const search = state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
  if (!search) throw new Error('Missing copied-attack search');
  return { state, player, store, supporters, search, moves, mew };
}

describe('Spiritomb UPR Lightless World public discard recovery', () => {
  it('does nothing when the discard has no Supporter', () => {
    const x = setup(0); expect(x.prompt).toBeUndefined(); expect(x.player.hand.cards).toEqual([]);
  });
  it('requires the only available Supporter', () => {
    const x = setup(1); expect(x.prompt.options.min).toBe(1); expect(x.prompt.options.max).toBe(1);
    expect(x.prompt.validate([])).toBe(false); expect(x.prompt.validate(null)).toBe(false);
    expect(x.prompt.validate([x.supporters[0]])).toBe(true); expect(x.prompt.validate([x.item])).toBe(false);
  });
  it('requires exactly two Supporters when there are three', () => {
    const x = setup(3); expect(x.prompt.options.min).toBe(2); expect(x.prompt.options.max).toBe(2);
    expect(x.prompt.validate([])).toBe(false); expect(x.prompt.validate([x.supporters[0]])).toBe(false);
    expect(x.prompt.validate(x.supporters.slice(0, 2))).toBe(true); expect(x.prompt.validate(x.supporters)).toBe(false);
  });
  it('moves only the two chosen Supporters with attack attribution', () => {
    const x = setup(3), selected = [x.supporters[0], x.supporters[2]];
    expect(x.prompt.validate(selected)).toBe(true);
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.prompt.id, selected));
    expect(x.player.hand.cards).toEqual(selected); expect(x.player.discard.cards).toContain(x.supporters[1]); expect(x.player.discard.cards).toContain(x.item);
    const move = x.moves.find(m => m.source === x.player.discard && m.destination === x.player.hand);
    expect(move).toBeDefined(); if (!move) return;
    expect(move.cards).toEqual(selected); expect(move.sourceCard).toBe(x.spiritomb);
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined) as ShowCardsPrompt;
    expect(show.playerId).toBe(x.opponent.id); expect(show.cards).toEqual(selected);
  });
  it('honors Pokémon Tower preventing attack effects from returning cards', () => {
    const x = setup(2); x.opponent.stadium.cards = [new PokemonTower()]; const selected = x.supporters;
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.prompt.id, selected));
    expect(x.player.hand.cards).toEqual([]); expect(x.player.discard.cards).toContain(selected[0]); expect(x.player.discard.cards).toContain(selected[1]);
  });
  it('honors Parasect N3 preventing attack effects from moving discard cards', () => {
    const x = setup(2), slot = new PokemonCardList(); slot.cards = [new Parasect()]; x.opponent.bench.push(slot);
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.prompt.id, x.supporters));
    expect(x.player.hand.cards).toEqual([]); expect(x.player.discard.cards).toContain(x.supporters[0]); expect(x.player.discard.cards).toContain(x.supporters[1]);
  });

  it('lets Mew copy Lightless World and recover two Supporters', () => {
    const x = setupCopied(false); expect(x.search.validate(x.supporters)).toBe(true);
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.search.id, x.supporters));
    expect(x.player.hand.cards).toEqual(x.supporters);
    const move = x.moves.find(m => m.source === x.player.discard && m.destination === x.player.hand);
    expect(move).toBeDefined(); if (!move) return;
    expect(move.sourceCard).toBe(x.mew); expect(move.sourceEffect instanceof AttackEffect).toBe(true);
    expect(move.sourceEffect.source).toBe(x.player.active);
  });
  it('honors Pokémon Tower when Mew copies Lightless World', () => {
    const x = setupCopied(true); expect(x.search.validate(x.supporters)).toBe(true);
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.search.id, x.supporters));
    expect(x.player.hand.cards).toEqual([]); expect(x.player.discard.cards.length).toBe(2);
  });

  it('honors Parasect when Mew copies Lightless World', () => {
    const x = setupCopied(false, true); expect(x.search.validate(x.supporters)).toBe(true);
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.search.id, x.supporters));
    expect(x.player.hand.cards).toEqual([]); expect(x.player.discard.cards.length).toBe(2);
  });
  it('does not let Parasect block an Item returning cards from discard, with or without provenance', () => {
    const x = setup(1), slot = new PokemonCardList(); slot.cards = [new Parasect()]; x.opponent.bench.push(slot);
    const item = new Item();
    expect(() => x.store.reduceEffect(x.state, new MoveCardsEffect(x.player.discard, x.player.hand,
      { cards: [x.supporters[0]], sourceCard: item }))).not.toThrow();
    expect(x.player.hand.cards).toContain(x.supporters[0]);
  });
  it('still lets Pokémon Tower block Items moving cards from discard to hand', () => {
    const x = setup(1); x.opponent.stadium.cards = [new PokemonTower()]; const item = new Item();
    x.store.reduceEffect(x.state, new MoveCardsEffect(x.player.discard, x.player.hand,
      { cards: [x.supporters[0]], sourceCard: item }));
    expect(x.player.hand.cards).toEqual([]); expect(x.player.discard.cards).toContain(x.supporters[0]);
  });
  it('does not let Pokémon Tower or Parasect block attacks moving cards from deck to hand', () => {
    const x = setup(0), slot = new PokemonCardList(); slot.cards = [new Parasect()]; x.opponent.bench.push(slot);
    x.opponent.stadium.cards = [new PokemonTower()]; const supporter = new Supporter('Deck Supporter');
    x.player.deck.cards = [supporter];
    const attack = new AttackEffect(x.player, x.opponent, x.spiritomb.attacks[0]);
    x.store.reduceEffect(x.state, new MoveCardsEffect(x.player.deck, x.player.hand,
      { cards: [supporter], sourceCard: x.spiritomb, sourceEffect: attack }));
    expect(x.player.hand.cards).toContain(supporter);
  });

  for (const invalid of ['zero', 'one', 'duplicate', 'stale', 'wrong-type', 'null', 'malformed', 'too-many'] as const) {
    it(`rejects ${invalid} choices without side effects and permits retry`, () => {
      const x = setup(3), stale = new Supporter('Stale'); stale.id = x.supporters[0].id;
      const choices: Record<typeof invalid, any> = {
        zero: [], one: [x.supporters[0]], duplicate: [x.supporters[0], x.supporters[0]],
        stale: [x.supporters[0], stale], 'wrong-type': [x.supporters[0], x.item], null: null,
        malformed: [x.supporters[0], undefined], 'too-many': x.supporters.slice()
      };
      expect(() => (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.prompt.id, choices[invalid]))).toThrow();
      expect(x.prompt.result).toBeUndefined(); expect(x.player.hand.cards).toEqual([]);
      expect(x.player.discard.cards.length).toBe(4); expect(x.moves.length).toBe(0);
      expect(x.state.prompts.some(p => p instanceof ShowCardsPrompt && p.result === undefined)).toBe(false);
      (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.prompt.id, x.supporters.slice(0, 2)));
      expect(x.player.hand.cards).toEqual(x.supporters.slice(0, 2));
    });
  }
  it('rejects a repeated discard index in the actual simulator and allows retry', () => {
    ensureClientCards(); const state = new State(); state.phase = GamePhase.PLAYER_TURN; state.turn = 2;
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
      for (let i = 0; i < 5; i++) add(player.deck, 'Fire Energy SVE');
      add(player.active, index ? 'Squirtle BS' : 'Spiritomb UPR');
    });
    add(state.players[0].active, 'Fire Energy SVE');
    add(state.players[0].discard, 'Iono PAL'); add(state.players[0].discard, 'Iono PAL');
    const simulator = new ClientSimulator(); simulator.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(state)) });
    simulator.dispatch(new AttackAction(1, 'Lightless World'));
    const prompt = simulator.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
    expect(prompt).toBeDefined();
    expect(() => simulator.resolvePrompt(prompt.id, [0, 0])).toThrow();
    expect(prompt.result).toBeUndefined(); expect(simulator.state.players[0].hand.cards.length).toBe(0);
    simulator.resolvePrompt(prompt.id, [0, 1]);
    expect(simulator.state.players[0].hand.cards.filter(card => card.name === 'Iono').length).toBe(2);
    simulator.cleanup();
  });

  for (const condition of [SpecialCondition.ASLEEP, SpecialCondition.CONFUSED, SpecialCondition.PARALYZED]) {
    it(`does not suppress Benched Parasect when another Active is ${condition}`, () => {
      const x = setup(2), slot = new PokemonCardList(); slot.cards = [new Parasect()]; x.opponent.bench.push(slot);
      x.opponent.active.specialConditions = [condition];
      (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.prompt.id, x.supporters));
      expect(x.player.hand.cards).toEqual([]); expect(x.player.discard.cards.length).toBe(3);
    });
    it(`preserves Benched Parasect against Mew's copied attack when another Active is ${condition}`, () => {
      const x = setupCopied(false, true); x.state.players[1].active.specialConditions = [condition];
      (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.search.id, x.supporters));
      expect(x.player.hand.cards).toEqual([]); expect(x.player.discard.cards.length).toBe(2);
    });
    it(`suppresses Active Parasect itself while ${condition}`, () => {
      const x = setup(2); x.opponent.active.cards = [new Parasect()]; x.opponent.active.specialConditions = [condition];
      (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.prompt.id, x.supporters));
      expect(x.player.hand.cards).toEqual(x.supporters);
    });
  }
  it('does not suppress Active Parasect merely for being Poisoned', () => {
    const x = setup(2); x.opponent.active.cards = [new Parasect()]; x.opponent.active.specialConditions = [SpecialCondition.POISONED];
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(x.prompt.id, x.supporters));
    expect(x.player.hand.cards).toEqual([]); expect(x.player.discard.cards.length).toBe(3);
  });

});
