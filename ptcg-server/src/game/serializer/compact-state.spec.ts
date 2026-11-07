import { CardManager } from '../cards/card-manager';
import { GameLog, GameMessage } from '../game-message';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { Base64 } from '../../utils/base64';
import { PlayCardAction, PlayerType, SlotType } from '../store/actions/play-card-action';
import { ChoosePokemonPrompt } from '../store/prompts/choose-pokemon-prompt';
import { CardList } from '../store/state/card-list';
import { Marker } from '../store/state/card-marker';
import { Player } from '../store/state/player';
import { PokemonCardList } from '../store/state/pokemon-card-list';
import { GamePhase, State } from '../store/state/state';
import { StateLog } from '../store/state/state-log';
import { StateSerializer } from './state-serializer';
import { GenericSerializer } from './generic.serializer';
import { COMPACT_STATE_DEFAULTS, compactSerializedState, restoreCompactDefaults } from './compact-state';

describe('compact serialized snapshots', () => {
  const serializer = new StateSerializer();
  const base64 = new Base64();

  function fixture(): State {
    ensureClientCards();
    const state = new State();
    state.phase = GamePhase.PLAYER_TURN;
    state.turn = 3;
    const add = (list: CardList, name: string) => {
      const card = CardManager.getInstance().getCardByName(name)!;
      card.id = state.cardNames.length;
      state.cardNames.push(card.fullName);
      list.cards.push(card);
    };
    state.players = [new Player(), new Player()];
    state.players.forEach((player, index) => {
      player.id = index === 0 ? 43 : 42;
      player.name = index === 0 ? 'Pokémon 🐱' : 'Opponent';
      player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
      player.prizes = Array.from({ length: 2 }, () => {
        const list = new CardList(); add(list, 'Fire Energy SVE'); return list;
      });
      for (let count = 0; count < 3; count++) { add(player.deck, 'Fire Energy SVE'); }
      add(player.active, index === 0 ? 'Charmander BS' : 'Squirtle BS');
    });
    add(state.players[0].hand, 'Potion BS');
    return state;
  }

  function fullCanonical(serialized: string): string {
    return serializer.serialize(serializer.deserialize(serialized));
  }

  it('pins every omitted wire default to the reviewed class contract', () => {
    const defaults: { [type: string]: any } = {
      State: new State(), Player: new Player(), CardList: new CardList(),
      PokemonCardList: new PokemonCardList(), Marker: new Marker()
    };
    for (const type of Object.keys(COMPACT_STATE_DEFAULTS)) {
      for (const key of Object.keys(COMPACT_STATE_DEFAULTS[type])) {
        expect({ field: type + '.' + key, value: defaults[type][key] })
          .toEqual({ field: type + '.' + key, value: COMPACT_STATE_DEFAULTS[type][key] });
      }
    }
    expect(COMPACT_STATE_DEFAULTS.PokemonCardList.tools).toBeUndefined();
    expect(COMPACT_STATE_DEFAULTS.Rules).toBeUndefined();
    expect(COMPACT_STATE_DEFAULTS.GameSettings).toBeUndefined();
  });

  it('fills only absent optional fields with independent mutable arrays', () => {
    const first: any = { _type: 'PokemonCardList', damage: 30, cannotAttackNextTurn: true, custom: false };
    const second: any = { _type: 'PokemonCardList' };
    restoreCompactDefaults(first, first._type);
    restoreCompactDefaults(second, second._type);
    expect(first.damage).toBe(30);
    expect(first.cannotAttackNextTurn).toBe(true);
    expect(first.custom).toBe(false);
    expect(second.damage).toBe(0);
    first.specialConditions.push('test');
    expect(second.specialConditions).toEqual([]);
    expect(first.cards).toBeUndefined();
    expect(first.tools).toBeUndefined();
    const state: any = { _type: 'State' };
    restoreCompactDefaults(state, state._type);
    for (const key of ['phase', 'turn', 'activePlayer', 'winner', 'logs', 'prompts', 'players', 'cardNames']) {
      expect({ key, present: Object.prototype.hasOwnProperty.call(state, key) }).toEqual({ key, present: false });
    }
  });

  it('restores the fixed wire defaults even when future constructors disagree', () => {
    class FuturePlayer extends Player {
      avatarName = 'future-avatar';
      usedVSTAR = true;
      supporterTurn = 99;
      movedToActiveThisTurn = [999];
    }
    class FutureMarker extends Marker {
      markers = [{ name: 'future-marker' }];
    }
    const state = fixture();
    state.players[1].avatarName = 'explicit-avatar';
    state.players[1].supporterTurn = 2;
    state.players[1].marker.addMarkerToState('explicit-marker');
    const compact = compactSerializedState(serializer.serialize(state));
    const future = new StateSerializer();
    future.serializers = future.serializers.map(row => row.types.includes('Player')
      ? new GenericSerializer(FuturePlayer, 'Player')
      : row.types.includes('Marker') ? new GenericSerializer(FutureMarker, 'Marker') : row);
    const restored = future.deserialize(compact);
    expect(restored.players[0].avatarName).toBe('');
    expect(restored.players[0].usedVSTAR).toBe(false);
    expect(restored.players[0].supporterTurn).toBe(0);
    expect(restored.players[0].movedToActiveThisTurn).toEqual([]);
    expect(restored.players[0].marker.markers).toEqual([]);
    expect(restored.players[0].marker.markers).not.toBe(restored.players[0].active.marker.markers);
    expect(restored.players[1].avatarName).toBe('explicit-avatar');
    expect(restored.players[1].supporterTurn).toBe(2);
    expect(restored.players[1].marker.hasMarker('explicit-marker')).toBe(true);
  });

  it('preserves full canonical state, nondefault effects, history, artwork and unknown fields', () => {
    const state = fixture();
    state.winConditions = { selfDeckOut: true, mustLose: false, cardsInDeck: 0 };
    state.gameSettings.rules = state.rules;
    state.skipOpponentTurn = true;
    state.players[0].avatarName = 'custom-avatar';
    state.players[0].usedVSTAR = true;
    state.players[0].active.damage = 20;
    state.players[0].active.hpBonus = 50;
    state.players[0].active.cannotAttackNextTurn = true;
    state.players[0].active.cannotUseAttacksNextTurn = ['Scratch'];
    state.players[0].active.marker.addMarker('active effect', state.players[0].hand.cards[0], 'trainer', 'pokemon');
    (state.players[0].active as any).artworksMap = { 'Charmander BS': { imageUrl: 'https://example.com/é.png' } };
    (state.players[0] as any).futureFlag = false;
    (state as any).unknown = { damage: 0, tools: [], empty: {}, slots: [null, false, 0, [], {}] };
    state.lastAttack = state.players[0].active.getPokemonCard()!.attacks[0];
    state.playerLastAttack[43] = { attack: state.lastAttack, sourceCard: state.players[0].active.getPokemonCard()! };
    state.logs = [new StateLog(GameLog.LOG_TURN, { turn: 3 })];
    const full = serializer.serialize(state);
    const compact = compactSerializedState(full);
    const raw = JSON.parse(compact);
    expect(compact.length).toBeLessThan(full.length);
    expect(raw[0][0].DAMAGE_DEALT_MARKER).toBeUndefined();
    expect(raw[0][0].active.triggerEvolutionAnimation).toBeUndefined();
    expect(raw[0][0].active.tools).toEqual([]);
    expect(raw[0][0].active.damage).toBe(20);
    expect(raw[0][0].active.cannotAttackNextTurn).toBe(true);
    expect(raw[0][0].futureFlag).toBe(false);
    expect(raw[1].unknown).toEqual((state as any).unknown);
    expect(raw[1].winConditions).toEqual(state.winConditions);
    expect(raw[1].logs.length).toBe(1);
    expect(raw[0][0].bench.length).toBe(5);
    expect(raw[0][0].prizes.length).toBe(2);
    expect(raw[0][0].hand.cards).toEqual([state.players[0].hand.cards[0].id]);
    expect(fullCanonical(compact)).toBe(fullCanonical(full));
    expect(compactSerializedState(compact)).toBe(compact);
    const restored = serializer.deserialize(compact);
    expect(restored.gameSettings.rules).toBe(restored.rules);
    expect(restored.players[0].active.marker.hasMarker('active effect', restored.players[0].hand.cards[0])).toBe(true);
  });

  it('keeps Ref targets and their ancestors even for default scalar and empty-array properties', () => {
    const raw = JSON.parse(serializer.serialize(fixture()));
    raw[0][0].arrayAlias = { _type: 'Ref', path: '0.0.movedToActiveThisTurn' };
    raw[0][0].zeroAlias = { _type: 'Ref', path: '0.0.active.damage' };
    raw[0][0].markerAlias = { _type: 'Ref', path: '0.0.active.marker.markers' };
    raw[0][0].marker.owner = { _type: 'Ref', path: '0.0' };
    raw[1].forwardAlias = { _type: 'Ref', path: '1.forwardMarker.markers' };
    raw[1].forwardMarker = { _type: 'Marker', markers: [] };
    const full = JSON.stringify(raw);
    const compact = compactSerializedState(full);
    const trimmed = JSON.parse(compact);
    expect(trimmed[0][0].movedToActiveThisTurn).toEqual([]);
    expect(trimmed[0][0].active.damage).toBe(0);
    expect(trimmed[0][0].active.marker.markers).toEqual([]);
    expect(trimmed[1].forwardMarker.markers).toEqual([]);
    const restored: any = serializer.deserialize(compact);
    expect(restored.players[0].arrayAlias).toBe(restored.players[0].movedToActiveThisTurn);
    expect(restored.players[0].zeroAlias).toBe(0);
    expect(restored.players[0].markerAlias).toBe(restored.players[0].active.marker.markers);
    expect(restored.players[0].marker.owner).toBe(restored.players[0]);
    expect(restored.forwardAlias).toBe(restored.forwardMarker.markers);
    expect(fullCanonical(compact)).toBe(fullCanonical(full));
  });

  it('preserves a legacy tool-only payload instead of overwriting its attachment with an empty tools array', () => {
    const state = fixture();
    const tool = CardManager.getInstance().getCardByName('Muscle Band XY')!;
    tool.id = state.cardNames.length;
    state.cardNames.push(tool.fullName);
    state.players[0].active.tools.push(tool);
    const raw = JSON.parse(serializer.serialize(state));
    delete raw[0][0].active.tools;
    const full = JSON.stringify(raw);
    const compact = compactSerializedState(full);
    expect(Object.prototype.hasOwnProperty.call(JSON.parse(compact)[0][0].active, 'tools')).toBe(false);
    const restored = serializer.deserialize(compact);
    expect(restored.players[0].active.tools.map(card => card.id)).toEqual([tool.id]);
    expect(fullCanonical(compact)).toBe(fullCanonical(full));
  });

  it('keeps host headers, prompt payloads, Rules, GameSettings and unknown typed data explicit', () => {
    const state = fixture();
    state.phase = GamePhase.WAITING_FOR_PLAYERS;
    state.turn = 0;
    state.prompts = [new ChoosePokemonPrompt(43, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      PlayerType.BOTTOM_PLAYER, [SlotType.BENCH], { allowCancel: false })];
    const full = serializer.serialize(state), raw = JSON.parse(full);
    raw[1].future = { _type: 'FutureShape', damage: 0, cards: [], isPublic: false };
    const compact = JSON.parse(compactSerializedState(JSON.stringify(raw)));
    for (const key of ['phase', 'turn', 'activePlayer', 'winner', 'logs', 'prompts', 'players', 'cardNames']) {
      expect({ key, value: compact[1][key] }).toEqual({ key, value: raw[1][key] });
    }
    expect(compact[1].rules).toEqual(raw[1].rules);
    expect(compact[1].gameSettings).toEqual(raw[1].gameSettings);
    expect(compact[1].future).toEqual(raw[1].future);
    expect(fullCanonical(compactSerializedState(full))).toBe(fullCanonical(full));
    expect(() => compactSerializedState('[[]]')).toThrowError('Expected a serialized [players, state] snapshot.');
  });

  it('emits stable compact snapshots through real prompts, history and old full snapshot restoration', () => {
    const state = fixture();
    state.players[0].active.damage = 30;
    const full = serializer.serialize(state);
    const simulator = new ClientSimulator();
    simulator.loadSnapshot({ stateData: base64.encode(full) });
    const initial = simulator.getStateData();
    const raw = JSON.parse(base64.decode(initial));
    expect(raw[0][0].DAMAGE_DEALT_MARKER).toBeUndefined();
    expect(raw[1].prompts).toEqual([]);
    const restored = new ClientSimulator();
    restored.loadSnapshot({ stateData: initial });
    expect(restored.getStateData()).toBe(initial);
    simulator.dispatch(new PlayCardAction(43, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
    const pending = simulator.state.prompts.find(prompt => prompt.result === undefined)!;
    expect(JSON.parse(base64.decode(simulator.getStateData()))[1].prompts.length).toBe(1);
    expect(fullCanonical(base64.decode(simulator.getStateData()))).toBe(serializer.serialize(simulator.state));
    simulator.resolvePrompt(pending.id, [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
    expect(simulator.state.players[0].active.damage).toBe(10);
    expect(simulator.undo()).toBe(true);
    expect(simulator.getStateData()).toBe(initial);
    simulator.pushState(base64.encode(full));
    expect(simulator.getStateData()).toBe(initial);
    expect(simulator.state.players.map(player => player.id)).toEqual([43, 42]);
    restored.cleanup(); simulator.cleanup();
  });
});
