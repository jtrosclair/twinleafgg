import { CardManager } from '../game/cards/card-manager';
import { StateSerializer } from '../game/serializer/state-serializer';
import { AttackAction, PassTurnAction, UseAbilityAction } from '../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../game/store/actions/play-card-action';
import { ChangeAvatarAction } from '../game/store/actions/change-avatar-action';
import { AbortGameAction, AbortGameReason } from '../game/store/actions/abort-game-action';
import { AppendLogAction } from '../game/store/actions/append-log-action';
import { ConcedeAction } from '../game/store/actions/concede-action';
import { ReorderBenchAction, ReorderHandAction } from '../game/store/actions/reorder-actions';
import { SandboxModifyPokemonAction } from '../game/store/actions/sandbox-modify-pokemon-action';
import { GameLog, GameMessage } from '../game/game-message';
import { AttackEffect } from '../game/store/effects/game-effects';
import { DealDamageEffect } from '../game/store/effects/attack-effects';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../game/store/effects/check-effects';
import { SpecialCondition, SuperType, TrainerType } from '../game/store/card/card-types';
import { Store } from '../game/store/store';
import { cloneAttacks, openCopyAttackSession } from '../game/store/prefabs/copy-attack-delegation';
import { CardList } from '../game/store/state/card-list';
import { Player } from '../game/store/state/player';
import { PokemonCardList } from '../game/store/state/pokemon-card-list';
import { GamePhase, GameWinner, State } from '../game/store/state/state';
import { Base64 } from '../utils/base64';
import { ensureClientCards } from './cards';
import { ClientSimulator } from './simulator';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { gunzipSync } from 'zlib';
import * as typescript from 'typescript';

describe('ClientSimulator', () => {
  function fixture(): { state: State; encode: () => string; add: (list: CardList, name: string) => void } {
    ensureClientCards();
    const state = new State();
    state.phase = GamePhase.PLAYER_TURN;
    state.turn = 2;
    state.players = [new Player(), new Player()];
    const add = (list: CardList, name: string) => {
      const card = CardManager.getInstance().getCardByName(name)!;
      card.id = state.cardNames.length;
      state.cardNames.push(card.fullName);
      list.cards.push(card);
    };
    state.players.forEach((player, index) => {
      player.id = index + 1;
      player.name = index === 0 ? 'Player' : 'Dummy';
      player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
      player.prizes = Array.from({ length: 6 }, () => new CardList());
      player.prizes.forEach(prize => add(prize, 'Fire Energy SVE'));
      for (let i = 0; i < 5; i++) {
        add(player.deck, 'Fire Energy SVE');
      }
      add(player.active, index === 0 ? 'Charmander BS' : 'Squirtle BS');
    });
    add(state.players[0].active, 'Fire Energy SVE');
    return { state, add, encode: () => new Base64().encode(new StateSerializer().serialize(state)) };
  }

  it('restores a detached copied Iron Rule through compact checkpoints and local undo', () => {
    const f = fixture();
    const [player, opponent] = f.state.players;
    player.id = 43;
    opponent.id = 42;
    player.active.moveTo(player.discard);
    f.add(player.active, 'Mew ex 30C');
    f.add(player.bench[0], 'Cobalion-GX TEU');
    const copycat = player.active.getPokemonCard()!;
    const source = player.bench[0].getPokemonCard()!;
    const attacks = cloneAttacks(source.attacks);
    const store = new Store({ onStateChange() {} });
    store.state = f.state;
    f.state.phase = GamePhase.ATTACK;
    openCopyAttackSession(f.state, player, copycat, source, attacks, attacks[1]);
    store.reduceEffect(f.state, new AttackEffect(player, opponent, attacks[1]));
    // The player-scoped attack lock must outlive its user's presence in play.
    player.active.moveTo(player.discard);
    f.add(player.active, 'Charmander BS');
    f.state.phase = GamePhase.PLAYER_TURN;

    const simulator = new ClientSimulator();
    try {
      simulator.loadSnapshot({ stateData: f.encode() });
      const assertRestriction = () => {
        const state = simulator.state;
        const restoredCopycat = state.players[0].discard.cards.find(card => card.id === copycat.id)!;
        const marker = state.players[1].marker.markers.find(item => item.name === 'IRON_RULE_MARKER')!;
        expect(restoredCopycat).toBeDefined();
        expect(restoredCopycat).not.toBe(copycat);
        expect(marker.source).toBe(restoredCopycat);
        expect(restoredCopycat).toBe(state.copiedAttackCheckpoints![0].copycatCard);
        expect(restoredCopycat).toBe(state.playerLastAttack[player.id].sourceCard);
        expect(state.players.map(owner => owner.id)).toEqual([43, 42]);
        expect(state.prompts.length).toBe(0);
        let blocked: { message: string } | undefined;
        try {
          const restoredStore: Store = (simulator as any).store;
          restoredStore.reduceEffect(state, new AttackEffect(state.players[1], state.players[0], {
            name: 'Checkpoint attack probe', cost: [], damage: 30, text: ''
          }));
        } catch (error) {
          blocked = error as { message: string };
        }
        expect(blocked && blocked.message).toBe(GameMessage.BLOCKED_BY_EFFECT);
      };
      assertRestriction();
      const checkpoint = simulator.getStateData();
      simulator.pushState(checkpoint);
      assertRestriction();
      expect(simulator.getStateData()).toBe(checkpoint);
      simulator.dispatch(new PassTurnAction(simulator.humanPlayerId));
      expect(simulator.canUndo()).toBe(true);
      expect(simulator.undo()).toBe(true);
      assertRestriction();
      expect(simulator.getStateData()).toBe(checkpoint);
    } finally {
      simulator.cleanup();
    }
  });

  it('restores Pokemon-as-Energy through native checkpoints, local undo and reset', () => {
    const f = fixture(), player = f.state.players[0];
    f.add(player.hand, "Holon's Magnemite DS");
    const simulator = new ClientSimulator();
    try {
      simulator.loadSnapshot({ stateData: f.encode() });
      const initial = simulator.getStateData(), cardId = simulator.state.players[0].hand.cards[0].id;
      simulator.dispatch(new UseAbilityAction(simulator.humanPlayerId, 'Special Energy Effect',
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 }));
      const prompt = simulator.state.prompts.find(item => item.result === undefined);
      if (prompt) { simulator.resolvePrompt(prompt.id, [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]); }
      const assertAttached = () => {
        const slot = simulator.state.players[0].active;
        const card = slot.energies.cards.find(item => item.id === cardId)!;
        expect(card).toBeDefined(); expect(card.superType).toBe(SuperType.ENERGY); expect(slot.cards).toContain(card);
      };
      assertAttached();
      const attached = simulator.getStateData();
      simulator.pushState(attached); assertAttached(); expect(simulator.getStateData()).toBe(attached);
      simulator.dispatch(new PassTurnAction(simulator.humanPlayerId));
      expect(simulator.undo()).toBe(true); assertAttached(); expect(simulator.getStateData()).toBe(attached);
      simulator.pushState(initial);
      expect(simulator.state.players[0].hand.cards.find(card => card.id === cardId)!.superType).toBe(SuperType.POKEMON);
      expect(simulator.getStateData()).toBe(initial);
      simulator.pushState(attached); assertAttached();
      simulator.pushState(initial); expect(simulator.getStateData()).toBe(initial);
    } finally { simulator.cleanup(); }
  });

  it('executes a trainer, rejects invalid prompt choices, and undoes entirely in memory', () => {
    const f = fixture();
    f.state.players[0].active.damage = 30;
    f.add(f.state.players[0].hand, 'Potion BS');
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    simulator.dispatch(new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
    const prompt = simulator.state.prompts.find(item => item.result === undefined)!;
    expect(prompt).toBeDefined();
    expect(() => simulator.resolvePrompt(prompt.id, null)).toThrow();
    simulator.resolvePrompt(prompt.id, [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
    expect(simulator.state.players[0].active.damage).toBe(10);
    expect(simulator.state.prompts.length).toBe(0);
    expect(simulator.undo()).toBe(true);
    expect(simulator.state.players[0].active.damage).toBe(30);
    expect(simulator.state.players[0].hand.cards[0].fullName).toBe('Potion BS');
  });

  [false, true].forEach(teraActive => {
    it('opens Area Zero bench slots before the first action with a Tera Pokemon ' + (teraActive ? 'Active' : 'Benched'), () => {
      const f = fixture();
      const player = f.state.players[0];
      if (teraActive) {
        player.active.moveTo(player.discard);
        f.add(player.active, 'Teal Mask Ogerpon ex TWM');
      }
      player.bench.forEach((slot, index) => f.add(slot,
        !teraActive && index === 0 ? 'Teal Mask Ogerpon ex TWM' : 'Squirtle BS'));
      f.add(player.stadium, 'Area Zero Underdepths SCR');
      for (let i = 0; i < 4; i++) { f.add(player.hand, 'Teal Mask Ogerpon ex TWM'); }
      // This is a transient engine guard, even if an external snapshot retained it.
      f.state.benchSizeChangeHandled = teraActive;
      const simulator = new ClientSimulator();
      simulator.loadSnapshot({ stateData: f.encode() });

      expect(simulator.state.players[0].bench.length).toBe(8);
      expect(simulator.state.players[1].bench.length).toBe(5);
      expect(simulator.state.players[0].playableCardIds).toContain(simulator.state.players[0].hand.cards[0].id);
      for (let index = 5; index < 8; index++) {
        expect(simulator.state.players[0].bench[index].isPublic).toBe(true);
        simulator.dispatch(new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index }));
        expect(simulator.state.players[0].bench[index].getPokemonCard()!.name).toBe('Teal Mask Ogerpon ex');
      }
      expect(simulator.state.players[0].playableCardIds).not.toContain(simulator.state.players[0].hand.cards[0].id);
      expect(() => simulator.dispatch(new PlayCardAction(1, 0,
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 8 }))).toThrow();

      expect(simulator.undo()).toBe(true);
      expect(simulator.state.players[0].bench.length).toBe(8);
      expect(simulator.state.players[0].bench[7].cards.length).toBe(0);
      const restored = simulator.getStateData();
      simulator.pushState(restored);
      simulator.dispatch(new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 7 }));
      expect(simulator.state.players[0].bench[7].getPokemonCard()!.name).toBe('Teal Mask Ogerpon ex');
    });
  });

  it('keeps five bench slots when Area Zero has no Tera Pokemon in play', () => {
    const f = fixture();
    const player = f.state.players[0];
    f.add(player.stadium, 'Area Zero Underdepths SCR');
    player.bench.forEach(slot => f.add(slot, 'Squirtle BS'));
    f.add(player.hand, 'Teal Mask Ogerpon ex TWM');
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    expect(simulator.state.players[0].bench.length).toBe(5);
    expect(simulator.state.players[0].playableCardIds).not.toContain(simulator.state.players[0].hand.cards[0].id);
    expect(() => simulator.dispatch(new PlayCardAction(1, 0,
      { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 5 }))).toThrow();
  });

  it('restores bench-limit discard prompts when Area Zero no longer has a Tera Pokemon', () => {
    const f = fixture();
    const player = f.state.players[0];
    f.add(player.stadium, 'Area Zero Underdepths SCR');
    player.bench.push(new PokemonCardList());
    player.bench.forEach(slot => f.add(slot, 'Squirtle BS'));
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    const prompt = simulator.state.prompts.find(item => item.result === undefined)!;
    expect(prompt.type).toBe('Choose pokemon');
    simulator.resolvePrompt(prompt.id, [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 5 }]);
    expect(simulator.state.players[0].bench.length).toBe(5);
    expect(simulator.state.players[0].discard.cards.map(card => card.fullName)).toEqual(['Squirtle BS']);
    expect(simulator.state.prompts.length).toBe(0);
    expect(simulator.state.turn).toBe(f.state.turn);
  });

  it('highlights all six playable Trainer copies in Phantom Maze without changing the puzzle or creating prompts', () => {
    const snapshot = JSON.parse(gunzipSync(readFileSync(resolve(__dirname,
      '../../../tools/fixtures/phantom-maze.snapshot.json.gz'))).toString('utf8'));
    const simulator = new ClientSimulator();
    const state = simulator.validateSnapshot(snapshot.stateData);
    const previousIds = state.players.map(player => player.playableCardIds.slice());
    const serializer = new StateSerializer();
    const before = serializer.serialize(state);
    const changed = jasmine.createSpy('stateChanged');
    const store = new Store({ onStateChange: changed });
    store.restoreState(state);
    const player = state.players[0];
    const trainers = player.hand.cards.filter(card => card.superType === SuperType.TRAINER);
    expect(trainers.map(card => card.name)).toEqual([
      'Cyrano', "N's PP Up", 'Transformation Tome', 'Secret Box', "N's PP Up", 'Transformation Tome'
    ]);
    expect(trainers.every(card => player.playableCardIds.includes(card.id))).toBe(true);
    expect(store.hasPrompts()).toBe(false);
    expect(state.prompts.length).toBe(0);
    expect(changed).not.toHaveBeenCalled();
    state.players.forEach((item, index) => item.playableCardIds = previousIds[index]);
    expect(serializer.serialize(state)).toBe(before);
    store.restoreState(state);
    expect(trainers.every(card => player.playableCardIds.includes(card.id))).toBe(true);
    expect(state.prompts.length).toBe(0);
    simulator.cleanup();
  });

  it('benches Munkidori with one Trainer scan and keeps display queries from repeating it', () => {
    const snapshot = JSON.parse(gunzipSync(readFileSync(resolve(__dirname,
      '../../../tools/fixtures/phantom-maze.snapshot.json.gz'))).toString('utf8'));
    const simulator = new ClientSimulator();
    simulator.loadSnapshot(snapshot);
    const store: Store = (simulator as any).store;
    const probes = spyOn<any>(store, 'checkTrainerPlay').and.callThrough();
    const player = simulator.state.players[0];
    const handIndex = player.hand.cards.findIndex(card => card.name === 'Munkidori');
    const benchIndex = player.bench.findIndex(list => list.cards.length === 0);
    simulator.dispatch(new PlayCardAction(player.id, handIndex,
      { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: benchIndex }));

    expect(player.bench[benchIndex].getPokemonCard()!.fullName).toBe('Munkidori TWM');
    expect(player.hand.cards.length).toBe(8);
    expect(player.playableCardIds).toEqual([17, 18, 19, 20, 21, 22]);
    expect(simulator.state.prompts.length).toBe(0);
    const trainerCount = player.hand.cards.filter(card => card.superType === SuperType.TRAINER).length;
    expect(probes.calls.count()).toBeLessThanOrEqual(trainerCount);
    const beforeQueries = probes.calls.count();
    for (const owner of simulator.state.players) {
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, list => {
        store.reduceEffect(simulator.state, new CheckHpEffect(owner, list));
        store.reduceEffect(simulator.state, new CheckPokemonTypeEffect(list));
      });
    }
    expect(probes.calls.count()).toBe(beforeQueries);
    expect(player.playableCardIds).toEqual([17, 18, 19, 20, 21, 22]);
    simulator.cleanup();
  });

  it('does not mutate live state or create prompts while checking evolution hints', () => {
    const f = fixture();
    const player = f.state.players[0];
    f.add(player.hand, 'Charmeleon BS');
    f.add(player.bench[0], 'Palafin TWM');
    const palafin = player.bench[0].getPokemonCard()!;
    palafin.movedToActiveThisTurn = true;
    const store = new Store({ onStateChange() {} });
    store.state = f.state;

    store.dispatch(new ChangeAvatarAction(player.id, 'new-avatar'));

    expect(player.playableCardIds).toContain(player.hand.cards[0].id);
    expect(player.marker.hasMarker('ABILITY_USED_MARKER', palafin)).toBe(false);
    expect(f.state.prompts.length).toBe(0);
    expect(store.hasPrompts()).toBe(false);
  });

  it('honors player-marker effects in isolated Trainer hints without changing the board', () => {
    const f = fixture();
    const player = f.state.players[0];
    f.add(player.hand, 'Potion BS');
    const card = player.hand.cards[0];
    const source = player.active.getPokemonCard()!;
    player.marker.addMarker('TEST_HINT_DAMAGE_BOOST', source);
    source.reducePlayerMarkerEffect = (_store, state, effect) => {
      if (effect instanceof DealDamageEffect) effect.damage += 20;
      return state;
    };
    card.canPlay = (store, state, owner) => {
      const opponent = state.players.find(p => p !== owner)!;
      const attack = new AttackEffect(owner, opponent, { name: 'Hint probe', cost: [], damage: 10, text: '' });
      const damage = new DealDamageEffect(attack, 10);
      store.reduceEffect(state, damage);
      return damage.damage === 30;
    };
    const store = new Store({ onStateChange() {} });
    store.state = f.state;

    store.dispatch(new ChangeAvatarAction(player.id, 'new-avatar'));

    expect(player.playableCardIds).toContain(card.id);
    expect(f.state.players[1].active.damage).toBe(0);
    expect(f.state.prompts.length).toBe(0);
  });

  it('refreshes Trainer hints after a prompt heals the last damaged Pokemon', () => {
    const f = fixture();
    const player = f.state.players[0];
    player.active.damage = 20;
    f.add(player.hand, 'Potion BS');
    f.add(player.hand, 'Potion BS');
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    const remainingId = simulator.state.players[0].hand.cards[1].id;
    expect(simulator.state.players[0].playableCardIds).toContain(remainingId);
    simulator.dispatch(new PlayCardAction(player.id, 0,
      { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
    const prompt = simulator.state.prompts.find(item => item.result === undefined)!;
    simulator.resolvePrompt(prompt.id,
      [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
    expect(simulator.state.players[0].active.damage).toBe(0);
    expect(simulator.state.players[0].playableCardIds).not.toContain(remainingId);
    expect(simulator.state.prompts.length).toBe(0);
    simulator.cleanup();
  });

  it('updates sandbox and reorder hints before notifying observers, without rescanning for a log', () => {
    const f = fixture();
    const player = f.state.players[0];
    f.state.gameSettings.sandboxMode = true;
    f.add(player.hand, 'Potion BS');
    f.add(player.bench[0], 'Squirtle BS');
    const cardId = player.hand.cards[0].id;
    const observed: number[][] = [];
    const store = new Store({ onStateChange: state => observed.push(state.players[0].playableCardIds.slice()) });
    store.restoreState(f.state);
    expect(player.playableCardIds).not.toContain(cardId);

    store.dispatch(new SandboxModifyPokemonAction(player.id, player.id, 'active', { damage: 20 }), 4);
    expect(observed[observed.length - 1]).toContain(cardId);
    store.dispatch(new ReorderBenchAction(player.id, 0, 1));
    expect(player.bench[1].getPokemonCard()!.name).toBe('Squirtle');
    expect(observed[observed.length - 1]).toContain(cardId);
    store.dispatch(new ReorderHandAction(player.id, [0]));
    expect(observed[observed.length - 1]).toContain(cardId);

    const probes = spyOn<any>(store, 'checkTrainerPlay').and.callThrough();
    const notifications = observed.length;
    store.dispatch(new AppendLogAction(player.id, GameLog.LOG_PLAYER_CONCEDED, {}));
    expect(probes).not.toHaveBeenCalled();
    expect(observed.length).toBe(notifications + 1);
    expect(observed[observed.length - 1]).toContain(cardId);
    store.cleanup();
  });

  [false, true].forEach(abort => {
    it('clears hints before notifying observers when the game ' + (abort ? 'aborts' : 'is conceded'), () => {
      const f = fixture();
      const player = f.state.players[0];
      f.add(player.hand, 'Potion BS');
      player.active.damage = 20;
      const observed: number[][] = [];
      const store = new Store({ onStateChange: state => observed.push(state.players[0].playableCardIds.slice()) });
      store.restoreState(f.state);
      expect(player.playableCardIds).toContain(player.hand.cards[0].id);
      store.dispatch(abort ? new AbortGameAction(player.id, AbortGameReason.DISCONNECTED) : new ConcedeAction(player.id));
      expect(f.state.phase).toBe(GamePhase.FINISHED);
      expect(observed.length).toBe(1);
      expect(observed[0]).toEqual([]);
      store.cleanup();
    });
  });

  it('requires discard energy and a Benched N Pokemon before highlighting N PP Up', () => {
    const f = fixture();
    const player = f.state.players[0];
    f.add(player.hand, "N's PP Up JTG");
    f.add(player.bench[0], "N's Zorua JTG");
    const card = player.hand.cards[0];
    const store = new Store({ onStateChange() {} });
    store.restoreState(f.state);
    expect(player.playableCardIds.includes(card.id)).toBe(false);
    f.add(player.discard, 'Fire Energy SVE');
    store.restoreState(f.state);
    expect(player.playableCardIds.includes(card.id)).toBe(true);
    player.bench[0].moveTo(player.discard);
    store.restoreState(f.state);
    expect(player.playableCardIds.includes(card.id)).toBe(false);
    expect(f.state.prompts.length).toBe(0);
  });

  it('highlights Secret Box only when three other cards can pay its discard cost', () => {
    const f = fixture();
    const player = f.state.players[0];
    f.add(player.hand, 'Secret Box TWM');
    const card = player.hand.cards[0];
    f.add(player.hand, 'Fire Energy SVE');
    f.add(player.hand, 'Fire Energy SVE');
    const store = new Store({ onStateChange() {} });
    store.restoreState(f.state);
    expect(player.playableCardIds.includes(card.id)).toBe(false);
    f.add(player.hand, 'Fire Energy SVE');
    store.restoreState(f.state);
    expect(player.playableCardIds.includes(card.id)).toBe(true);
    expect(player.hand.cards.length).toBe(4);
    expect(player.supporter.cards.length).toBe(0);
    expect(player.discard.cards.length).toBe(0);
    expect(f.state.prompts.length).toBe(0);
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    simulator.dispatch(new PlayCardAction(player.id, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
    const prompt = simulator.state.prompts.find(item => item.result === undefined)!;
    expect(prompt.type).toBe('Choose cards');
    expect(prompt.playerId).toBe(player.id);
    simulator.cleanup();
  });

  it('requires a second Transformation Tome and a Basic Pokemon in the discard', () => {
    const f = fixture();
    const player = f.state.players[0];
    f.add(player.hand, 'Transformation Tome CRI');
    f.add(player.discard, 'Squirtle BS');
    const first = player.hand.cards[0];
    const store = new Store({ onStateChange() {} });
    store.restoreState(f.state);
    expect(player.playableCardIds.includes(first.id)).toBe(false);
    f.add(player.hand, 'Transformation Tome CRI');
    store.restoreState(f.state);
    expect(player.hand.cards.every(card => player.playableCardIds.includes(card.id))).toBe(true);
    player.discard.moveTo(player.deck);
    store.restoreState(f.state);
    expect(player.playableCardIds.includes(first.id)).toBe(false);
    expect(f.state.prompts.length).toBe(0);
  });

  it('keeps Item locks and the Supporter allowance authoritative for legacy Trainer hints', () => {
    const snapshot = JSON.parse(gunzipSync(readFileSync(resolve(__dirname,
      '../../../tools/fixtures/phantom-maze.snapshot.json.gz'))).toString('utf8'));
    const simulator = new ClientSimulator();
    const state = simulator.validateSnapshot(snapshot.stateData);
    const player = state.players[0];
    const store = new Store({ onStateChange() {} });
    player.supporterTurn = 1;
    store.restoreState(state);
    const supporter = player.hand.cards.find(card => (card as any).trainerType === TrainerType.SUPPORTER)!;
    const items = player.hand.cards.filter(card => (card as any).trainerType === TrainerType.ITEM);
    expect(player.playableCardIds.includes(supporter.id)).toBe(false);
    expect(items.every(card => player.playableCardIds.includes(card.id))).toBe(true);
    player.supporterTurn = 0;
    player.marker.addMarker(player.ATTACK_EFFECT_ITEM_LOCK, items[0]);
    store.restoreState(state);
    expect(items.some(card => player.playableCardIds.includes(card.id))).toBe(false);
    expect(player.playableCardIds.includes(supporter.id)).toBe(true);
    expect(state.prompts.length).toBe(0);
    simulator.cleanup();
  });

  it('takes prizes, automatically promotes the dummy bench, and stops after one human turn', () => {
    const f = fixture();
    f.state.players[1].active.damage = 30;
    f.add(f.state.players[1].bench[0], 'Charmander BS');
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    simulator.dispatch(new AttackAction(1, 'Scratch'));
    expect(simulator.state.players[1].active.getPokemonCard()!.fullName).toBe('Charmander BS');
    expect(simulator.state.players[0].getPrizeLeft()).toBe(5);
    expect(simulator.state.prompts.length).toBe(0);
    expect(simulator.state.phase).toBe(GamePhase.PLAYER_TURN);
    expect(simulator.complete).toBe(true);
    expect(() => simulator.dispatch(new PassTurnAction(1))).toThrow();
    expect(simulator.undo()).toBe(true);
    expect(simulator.complete).toBe(false);
    expect(simulator.state.players[1].active.damage).toBe(30);
  });

  it('waits for a human promotion during checkup before ending the attempt', () => {
    const f = fixture();
    f.state.players[0].active.damage = 40;
    f.state.players[0].active.specialConditions = [SpecialCondition.POISONED];
    f.add(f.state.players[0].bench[0], 'Squirtle BS');
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    simulator.dispatch(new PassTurnAction(1));
    const prompt = simulator.state.prompts.find(item => item.playerId === 1 && item.result === undefined)!;
    expect(prompt).toBeDefined();
    expect(simulator.complete).toBe(false);
    simulator.resolvePrompt(prompt.id, [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }]);
    expect(simulator.state.players[0].active.getPokemonCard()!.fullName).toBe('Squirtle BS');
    expect(simulator.state.prompts.length).toBe(0);
    expect(simulator.complete).toBe(true);
  });

  it('uses the engine win conditions for a knockout win and preserves a pushed snapshot', () => {
    const f = fixture();
    f.state.players[1].active.damage = 30;
    const original = f.encode();
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: original, winConditions: { cardsInDeck: 4 } });
    simulator.dispatch(new AttackAction(1, 'Scratch'));
    const prompt = simulator.state.prompts.find(item => item.playerId === 1 && item.result === undefined);
    if (prompt) { simulator.resolvePrompt(prompt.id, [0]); }
    expect(simulator.state.phase).toBe(GamePhase.FINISHED);
    expect(simulator.state.winner).toBe(GameWinner.PLAYER_2);
    simulator.pushState(original);
    expect(simulator.complete).toBe(false);
    expect(simulator.state.players[1].active.damage).toBe(30);
    expect(simulator.state.winConditions!.cardsInDeck).toBe(4);
  });

  it('applies mustLose to an actual engine loss while a normal pass just ends the attempt', () => {
    const f = fixture();
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    simulator.dispatch(new PassTurnAction(1));
    expect(simulator.complete).toBe(true);
    expect(simulator.state.phase).toBe(GamePhase.PLAYER_TURN);
    expect(simulator.state.turn).toBe(3);
    const g = fixture();
    g.state.activePlayer = 1;
    g.state.players[0].deck.cards = [];
    simulator.loadSnapshot({ stateData: g.encode(), winConditions: { mustLose: true } });
    expect(simulator.state.phase).toBe(GamePhase.FINISHED);
    expect(simulator.state.winner).toBe(GameWinner.PLAYER_1);
  });

  it('passes a starting dummy turn and publishes stable snapshots with executable cards', () => {
    const f = fixture();
    f.state.activePlayer = 1;
    const emitted: string[] = [];
    let simulator: ClientSimulator;
    simulator = new ClientSimulator(() => emitted.push(simulator.getStateData()));
    simulator.loadSnapshot({ stateData: f.encode() });
    expect(simulator.state.activePlayer).toBe(0);
    expect(simulator.complete).toBe(false);
    expect(emitted.length).toBe(1);
    expect(simulator.state.players[0].active.getPokemonCard()!.reduceEffect).toEqual(jasmine.any(Function));
    simulator.dispatch(new PassTurnAction(1));
    expect(simulator.complete).toBe(true);
    expect(emitted.length).toBe(2);
  });

  it('resolves shuffle and coin flip prompts locally', () => {
    const f = fixture();
    f.add(f.state.players[0].hand, 'Shauna XY');
    f.add(f.state.players[0].hand, 'Fire Energy SVE');
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    simulator.dispatch(new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
    expect(simulator.state.prompts.length).toBe(0);
    expect(simulator.state.players[0].hand.cards.length).toBe(5);

    const g = fixture();
    g.state.players[0].active.cards = [];
    g.add(g.state.players[0].active, 'Squirtle BS');
    g.add(g.state.players[0].active, 'Water Energy SVE');
    spyOn(Math, 'random').and.returnValue(0.1);
    simulator.loadSnapshot({ stateData: g.encode() });
    simulator.dispatch(new AttackAction(1, 'Bubble'));
    expect(simulator.state.prompts.length).toBe(0);
    expect(simulator.complete).toBe(true);
    expect(simulator.state.players[1].active.specialConditions).toContain(SpecialCondition.PARALYZED);
  });

  it('applies the self-deck-out goal and accepts a matching cards-in-deck goal', () => {
    const simulator = new ClientSimulator();
    for (const example of [
      { winConditions: { selfDeckOut: true }, winner: GameWinner.PLAYER_2 },
      { winConditions: { cardsInDeck: 5 }, winner: GameWinner.PLAYER_1 }
    ]) {
      const f = fixture();
      f.state.players[1].active.damage = 30;
      simulator.loadSnapshot({ stateData: f.encode(), winConditions: example.winConditions });
      simulator.dispatch(new AttackAction(1, 'Scratch'));
      expect(simulator.state.phase).toBe(GamePhase.FINISHED);
      expect(simulator.state.winner).toBe(example.winner);
    }
  });

  it('preserves imported player IDs and references used by prior-attack effects', () => {
    const f = fixture();
    f.state.players[0].id = 8;
    f.state.players[1].id = 13;
    const humanCard = f.state.players[0].active.getPokemonCard()!;
    const opponentCard = f.state.players[1].active.getPokemonCard()!;
    f.state.playerLastAttack[13] = { attack: opponentCard.attacks[0], sourceCard: opponentCard };
    f.state.players[1].active.attackDamageKnockOut = {
      attack: humanCard.attacks[0], sourceCard: humanCard, playerId: 8, turn: f.state.turn - 1
    };
    f.state.players[0].marker.addMarker('prior attack source', opponentCard);
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    expect(simulator.humanPlayerId).toBe(8);
    expect(simulator.opponentPlayerId).toBe(13);
    expect(simulator.state.playerLastAttack[13].sourceCard).toBe(simulator.state.players[1].active.getPokemonCard()!);
    expect(simulator.state.players[1].active.attackDamageKnockOut!.playerId).toBe(8);
    expect(simulator.state.players[0].marker.markers[0].source).toBe(simulator.state.players[1].active.getPokemonCard());
    simulator.dispatch(new AttackAction(simulator.humanPlayerId, 'Scratch'));
    expect(simulator.complete).toBe(true);
    expect(simulator.state.players[1].active.damage).toBe(10);
    expect(simulator.state.playerLastAttack[8].attack.name).toBe('Scratch');
    expect(simulator.undo()).toBe(true);
    expect(simulator.humanPlayerId).toBe(8);
    expect(simulator.state.playerLastAttack[13].sourceCard).toBe(simulator.state.players[1].active.getPokemonCard()!);
  });

  it('keeps the previous session playable when malformed or failing snapshots are pushed', () => {
    const f = fixture();
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: f.encode() });
    const previous = simulator.state;
    const original = simulator.getStateData();
    const malformed = JSON.parse(new Base64().decode(original));
    malformed[0][0].bench = null;
    expect(() => simulator.pushState(new Base64().encode(JSON.stringify(malformed)))).toThrow();
    expect(simulator.state).toBe(previous);
    expect(simulator.getStateData()).toBe(original);

    const g = fixture();
    g.state.activePlayer = 1;
    g.state.players[1].active.specialConditions = [SpecialCondition.ASLEEP];
    const random = spyOn(Math, 'random').and.throwError('Random source failed during automatic checkup.');
    expect(() => simulator.pushState(g.encode())).toThrow();
    expect(simulator.state).toBe(previous);
    expect(simulator.getStateData()).toBe(original);
    expect(simulator.complete).toBe(false);
    random.and.callThrough();
    simulator.dispatch(new AttackAction(simulator.humanPlayerId, 'Scratch'));
    expect(simulator.complete).toBe(true);
    expect(simulator.state.players[1].active.damage).toBe(10);
  });

  it('loads the historical PrizeMap snapshot with legacy plain rules and settings', () => {
    // Preserve the real legacy regression independently of the viewer's demo UI.
    const fixture = JSON.parse(gunzipSync(readFileSync(resolve(__dirname,
      '../../../tools/fixtures/legacy-prizemap.snapshot.json.gz'))).toString('utf8'));
    const stateData = fixture.stateData;
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData });
    expect(simulator.humanPlayerId).toBe(43);
    expect(simulator.opponentPlayerId).toBe(42);
    expect(simulator.state.cardNames.length).toBe(120);
    expect(simulator.state.rules.attackFirstTurn).toBe(true);
    expect(simulator.state.rules.firstTurnDrawCard).toBe(true);
    expect(simulator.state.rules.supporterCleanupAtEndTurn).toBe(false);
    expect(simulator.state.gameSettings.rules).toBe(simulator.state.rules);
    expect(simulator.state.activePlayer).toBe(0);
    expect(simulator.complete).toBe(false);
    simulator.dispatch(new PassTurnAction(simulator.humanPlayerId));
    expect(simulator.complete).toBe(true);
  });

  it('rejects invalid legacy rule values instead of accepting a malformed settings object', () => {
    const f = fixture();
    const parsed = JSON.parse(new Base64().decode(f.encode()));
    parsed[1].rules = { attackFirstTurn: 'invalid' };
    const simulator = new ClientSimulator();
    expect(() => simulator.loadSnapshot({ stateData: new Base64().encode(JSON.stringify(parsed)) })).toThrow();
  });

  it('preserves the optional burn rule wire shape and accepts absent, true, and false', () => {
    const f = fixture();
    const base = JSON.parse(new Base64().decode(f.encode()));
    expect(Object.prototype.hasOwnProperty.call(base[1].rules, 'oldBurnRule')).toBe(false);
    const simulator = new ClientSimulator();
    for (const value of [undefined, true, false]) {
      const parsed = JSON.parse(JSON.stringify(base));
      if (value !== undefined) { parsed[1].rules.oldBurnRule = value; }
      const state = simulator.loadSnapshot({ stateData: new Base64().encode(JSON.stringify(parsed)) });
      expect(state.rules.oldBurnRule).toBe(value);
      const encoded = JSON.parse(new Base64().decode(simulator.getStateData()));
      expect(Object.prototype.hasOwnProperty.call(encoded[1].rules, 'oldBurnRule')).toBe(value !== undefined);
      if (value !== undefined) { expect(encoded[1].rules.oldBurnRule).toBe(value); }
    }
    simulator.cleanup();
  });

  it('does not emit an undefined optional burn rule under defined class-field semantics', () => {
    const source = readFileSync(resolve(__dirname, '../../src/game/store/state/rules.ts'), 'utf8');
    for (const target of [typescript.ScriptTarget.ES2017, typescript.ScriptTarget.ES2022]) {
      const js = typescript.transpileModule(source, {
        compilerOptions: { target, module: typescript.ModuleKind.CommonJS, useDefineForClassFields: true }
      }).outputText;
      const output: { exports: any } = { exports: {} };
      new Function('exports', 'module', js)(output.exports, output);
      const rules = new output.exports.Rules();
      expect(Object.prototype.hasOwnProperty.call(rules, 'oldBurnRule')).toBe(false);
      expect(new output.exports.Rules({ oldBurnRule: true }).oldBurnRule).toBe(true);
      expect(new output.exports.Rules({ oldBurnRule: false }).oldBurnRule).toBe(false);
    }
  });

  it('rejects explicitly malformed optional burn rules', () => {
    const f = fixture();
    const base = JSON.parse(new Base64().decode(f.encode()));
    const simulator = new ClientSimulator();
    for (const value of [null, 0, 1, 'true', [], {}]) {
      const parsed = JSON.parse(JSON.stringify(base));
      parsed[1].rules.oldBurnRule = value;
      expect(() => simulator.loadSnapshot({ stateData: new Base64().encode(JSON.stringify(parsed)) })).toThrow();
    }
    simulator.cleanup();
  });

  it('normalizes repeated legacy names once while preserving exact cards and physical IDs', () => {
    const f = fixture();
    const parsed = JSON.parse(new Base64().decode(f.encode()));
    const alias = 'Fire Energy SVE 9999';
    parsed[1].cardNames = parsed[1].cardNames.map((name: string) => name === 'Fire Energy SVE' ? alias : name);
    const normalize = spyOn(StateSerializer, 'normalizeCardName').and.callThrough();
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: new Base64().encode(JSON.stringify(parsed)) });
    expect(normalize.calls.count()).toBe(1);
    expect(normalize).toHaveBeenCalledWith(alias);
    expect(simulator.state.cardNames).toEqual(f.state.cardNames);
    expect(simulator.state.players[0].active.cards.map(card => card.id))
      .toEqual(f.state.players[0].active.cards.map(card => card.id));
    simulator.dispatch(new AttackAction(simulator.humanPlayerId, 'Scratch'));
    expect(simulator.state.players[1].active.damage).toBe(10);
  });

  it('repairs exact legacy Unicode names without changing canonical state, physical references, or a reset', () => {
    const f = fixture();
    f.add(f.state.players[0].hand, 'Poké Pad MC');
    f.add(f.state.players[0].hand, 'Pokémon Center Lady M1S');
    // This exact printing must keep priority over the base-name compatibility lookup.
    f.add(f.state.players[0].hand, 'Pokémon Center Lady FLF 105');
    f.state.gameSettings.rules = f.state.rules;
    f.state.players[0].marker.addMarker('startup card', f.state.players[0].hand.cards[0]);
    const original = f.encode();
    const parsed = JSON.parse(new Base64().decode(original));
    parsed[1].cardNames = parsed[1].cardNames.map((name: string) => {
      return name === 'Poké Pad MC' || name === 'Pokémon Center Lady M1S' ? name.replace('é', '�') : name;
    });
    const normalize = spyOn(StateSerializer, 'normalizeCardName').and.callThrough();
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: original });
    const canonical = simulator.getStateData();
    simulator.loadSnapshot({ stateData: new Base64().encode(JSON.stringify(parsed)) });
    expect(normalize).not.toHaveBeenCalled();
    expect(simulator.getStateData()).toBe(canonical);
    expect(simulator.state.players[0].hand.cards.map(card => [card.id, card.fullName]))
      .toEqual(f.state.players[0].hand.cards.map(card => [card.id, card.fullName]));
    expect(simulator.state.players[0].marker.hasMarker('startup card', simulator.state.players[0].hand.cards[0])).toBe(true);
    expect(simulator.state.gameSettings.rules).toBe(simulator.state.rules);
    expect(simulator.state.players[0].hand.cards.every(card => typeof card.reduceEffect === 'function')).toBe(true);
    simulator.dispatch(new AttackAction(simulator.humanPlayerId, 'Scratch'));
    expect(simulator.state.players[1].active.damage).toBe(10);
    simulator.pushState(original);
    expect(simulator.getStateData()).toBe(canonical);
    expect(simulator.complete).toBe(false);
  });

  it('retains legacy alias normalization when a repaired name has no exact printing', () => {
    const f = fixture();
    f.add(f.state.players[0].hand, 'Poké Pad MC');
    const parsed = JSON.parse(new Base64().decode(f.encode()));
    const alias = 'Pok� Pad MC 198';
    expect(StateSerializer.hasKnownCard(alias.replace('�', 'é'))).toBe(false);
    parsed[1].cardNames = parsed[1].cardNames.map((name: string) => name === 'Poké Pad MC' ? alias : name);
    const normalize = spyOn(StateSerializer, 'normalizeCardName').and.callThrough();
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: new Base64().encode(JSON.stringify(parsed)) });
    expect(normalize.calls.count()).toBe(1);
    expect(normalize).toHaveBeenCalledWith(alias);
    expect(simulator.state.cardNames).toEqual(f.state.cardNames);
    expect(simulator.state.players[0].hand.cards[0].fullName).toBe('Poké Pad MC');
  });

  it('restores forward references on typed holders and preserves shared rules and cyclic identity', () => {
    const f = fixture();
    f.state.gameSettings.rules = f.state.rules;
    f.state.winConditions = { mustLose: true, cardsInDeck: 5, selfDeckOut: true };
    const serializer = new StateSerializer();
    const parsed = JSON.parse(serializer.serialize(f.state));
    parsed[0][0].sharedOpponent = { _type: 'Ref', path: '0.1' };
    parsed[0][0].active.sharedOpponentList = { _type: 'Ref', path: '0.1.active' };
    parsed[0][0].active.energies.owner = { _type: 'Ref', path: '0.0.active' };
    parsed[0][0].marker.sharedActiveMarker = { _type: 'Ref', path: '0.0.active.marker' };
    const restored: any = serializer.deserialize(JSON.stringify(parsed));
    expect(restored.players[0].sharedOpponent).toBe(restored.players[1]);
    expect(restored.players[0].active.sharedOpponentList).toBe(restored.players[1].active);
    expect(restored.players[0].active.energies.owner).toBe(restored.players[0].active);
    expect(restored.players[0].marker.sharedActiveMarker).toBe(restored.players[0].active.marker);
    expect(restored.gameSettings.rules).toBe(restored.rules);
    expect(restored.winConditions).toEqual(f.state.winConditions);
    const canonical = serializer.serialize(restored);
    expect(serializer.serialize(serializer.deserialize(canonical))).toBe(canonical);
    expect(restored.players.map((player: Player) => player.id)).toEqual([1, 2]);
  });

  it('restores forward tool and marker sources to physical cards and rejects missing reference paths', () => {
    const f = fixture();
    const tool = CardManager.getInstance().getCardByName('Muscle Band XY')!;
    tool.id = f.state.cardNames.length;
    f.state.cardNames.push(tool.fullName);
    f.state.players[0].active.tools.push(tool);
    f.state.players[0].marker.addMarker('tool source', tool, 'trainer', 'player');
    const serializer = new StateSerializer();
    const parsed = JSON.parse(serializer.serialize(f.state));
    parsed[0][0].active.tools[0] = { _type: 'Ref', path: '1.forwardTool' };
    parsed[1].forwardTool = { _type: 'Card', index: tool.id };
    parsed[1].ignoredCardFields = { _type: 'Card', index: tool.id,
      discardedReference: { _type: 'Ref', path: '0.99.active' },
      discardedContainer: { nested: { _type: 'Ref', path: '0.99.active' } },
      discardedArray: [{ _type: 'Ref', path: '0.99.active' }] };
    parsed[0][0].active.marker.markers.push({ name: 'opponent source', source: { _type: 'Ref', path: '0.1.active.cards.0' } });
    const restored = serializer.deserialize(JSON.stringify(parsed));
    const restoredTool = restored.players[0].active.tools[0];
    expect(restoredTool.id).toBe(tool.id);
    expect(restoredTool.fullName).toBe(tool.fullName);
    expect((restored as any).ignoredCardFields).toBe(restoredTool);
    expect(Object.prototype.hasOwnProperty.call(restoredTool, 'discardedReference')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(restoredTool, 'discardedContainer')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(restoredTool, 'discardedArray')).toBe(false);
    expect(restored.players[0].marker.hasMarker('tool source', restoredTool)).toBe(true);
    expect(restored.players[0].active.marker.hasMarker('opponent source', restored.players[1].active.cards[0])).toBe(true);
    const canonical = serializer.serialize(restored);
    expect(serializer.serialize(serializer.deserialize(canonical))).toBe(canonical);
    parsed[0][0].active.tools[0].path = '0.99.active';
    expect(() => serializer.deserialize(JSON.stringify(parsed))).toThrow();
  });
});
