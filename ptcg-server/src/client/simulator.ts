import { Arbiter } from '../game/core/arbiter';
import { GameSettings } from '../game/core/game-settings';
import { GameError } from '../game/game-error';
import { GameMessage } from '../game/game-message';
import { StateSerializer } from '../game/serializer/state-serializer';
import { compactSerializedState } from '../game/serializer/compact-state';
import { Action } from '../game/store/actions/action';
import { PassTurnAction } from '../game/store/actions/game-actions';
import { ResolvePromptAction } from '../game/store/actions/resolve-prompt-action';
import { Card } from '../game/store/card/card';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../game/store/effects/check-effects';
import { Prompt } from '../game/store/prompts/prompt';
import { ConfirmCardsPrompt } from '../game/store/prompts/confirm-cards-prompt';
import { SelectOptionPrompt } from '../game/store/prompts/select-option-prompt';
import { ShowCardsPrompt } from '../game/store/prompts/show-cards-prompt';
import { ShowMulliganPrompt } from '../game/store/prompts/show-mulligan-prompt';
import { WaitPrompt } from '../game/store/prompts/wait-prompt';
import { GamePhase, State, WinConditions } from '../game/store/state/state';
import { CardList } from '../game/store/state/card-list';
import { Marker } from '../game/store/state/card-marker';
import { Player } from '../game/store/state/player';
import { PokemonCardList } from '../game/store/state/pokemon-card-list';
import { Rules } from '../game/store/state/rules';
import { Store } from '../game/store/store';
import { StoreHandler } from '../game/store/store-handler';
import { PromptResolver } from '../simple-bot/prompt-resolver/prompt-resolver';
import { allPromptResolvers, defaultArbiterOptions, defaultStateScores } from '../simple-bot/simple-bot-definitions';
import { SimpleBotOptions } from '../simple-bot/simple-bot-options';
import { Base64 } from '../utils/base64';
import { ensureClientCards } from './cards';

export interface SnapshotOptions {
  stateData: string;
  gameSettings?: Partial<GameSettings>;
  winConditions?: WinConditions;
  opponentUsername?: string;
}

/** One in-memory puzzle session. There are no transports, users, or persistence. */
export class ClientSimulator implements StoreHandler {
  public gameSettings = new GameSettings();
  public complete = false;

  private store = new Store(this);
  private serializer = new StateSerializer();
  private arbiter = new Arbiter();
  private resolvers: PromptResolver[];
  private humanTurn: number | undefined;
  private snapshotOptions: SnapshotOptions | undefined;
  private history: string[] = [];

  constructor(private notify?: (state: State) => void) {
    ensureClientCards();
    const options: SimpleBotOptions = {
      tactics: [],
      promptResolvers: allPromptResolvers,
      scores: defaultStateScores,
      arbiter: defaultArbiterOptions
    };
    this.resolvers = allPromptResolvers.map(Resolver => new Resolver(options));
  }

  public get state(): State {
    return this.store.state;
  }

  public get humanPlayerId(): number {
    return this.state.players[0]?.id ?? 1;
  }

  public get opponentPlayerId(): number {
    return this.state.players[1]?.id ?? 2;
  }

  /** Store callbacks are settled synchronously before publishing a single update. */
  public onStateChange(state: State): void { }

  public loadSnapshot(options: SnapshotOptions): State {
    return this.restoreSnapshot(options, []);
  }

  private restoreSnapshot(options: SnapshotOptions, history: string[]): State {
    const state = this.decodeSnapshot(options.stateData);
    const previous = {
      store: this.store,
      history: this.history,
      snapshotOptions: this.snapshotOptions,
      gameSettings: this.gameSettings,
      complete: this.complete,
      humanTurn: this.humanTurn
    };
    try {
      this.history = history;
      this.snapshotOptions = options;
      this.gameSettings = Object.assign(new GameSettings(), state.gameSettings, options.gameSettings, {
        sandboxMode: true,
        timeLimit: 0,
        recordingEnabled: false
      });
      state.gameSettings = this.gameSettings;
      if (options.winConditions !== undefined) {
        state.winConditions = { ...options.winConditions };
      }
      state.prompts = [];
      this.complete = state.phase === GamePhase.FINISHED;
      this.humanTurn = state.activePlayer === 0 ? state.turn : undefined;
      this.store = new Store(this);
      this.store.restoreState(state);
      this.settle();
      return this.publish();
    } catch (error) {
      // A failed rewind must leave its playable Store and continuation closures intact.
      Object.assign(this, previous);
      throw error;
    }
  }

  public validateSnapshot(stateData: string): State {
    return this.decodeSnapshot(stateData);
  }

  public dispatch(action: Action): State {
    if (!this.snapshotOptions || this.complete) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    if ('clientId' in action && (action as any).clientId !== this.humanPlayerId) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    const previous = this.state.prompts.some(prompt => prompt.result === undefined)
      ? undefined : this.getStateData();
    this.store.state = this.store.dispatch(action, 4);
    if (previous !== undefined) {
      this.history.push(previous);
      if (this.history.length > 30) {
        this.history.shift();
      }
    }
    this.settle();
    return this.publish();
  }

  public resolvePrompt(id: number, result: any): State {
    const prompt = this.state.prompts.find(item => item.id === id && item.result === undefined);
    if (!prompt || prompt.playerId !== this.humanPlayerId) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const decoded = prompt.decode(result, this.state);
    if (!prompt.validate(decoded, this.state)) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return this.dispatch(new ResolvePromptAction(id, decoded));
  }

  /** Native undo supplies a previously emitted, stable snapshot. */
  public pushState(stateData: string): State {
    if (!this.snapshotOptions) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    return this.loadSnapshot({ ...this.snapshotOptions, stateData });
  }

  public getStateData(): string {
    return new Base64().encode(compactSerializedState(this.serializer.serialize(this.state)));
  }

  public canUndo(): boolean { return this.history.length > 0; }

  public undo(): boolean {
    const stateData = this.history[this.history.length - 1];
    if (stateData === undefined || !this.snapshotOptions) {
      return false;
    }
    const remaining = this.history.slice(0, -1);
    this.restoreSnapshot({ ...this.snapshotOptions, stateData }, remaining);
    return true;
  }

  public cleanup(): void {
    this.store.cleanup();
    this.arbiter.cleanup();
    this.snapshotOptions = undefined;
    this.complete = false;
    this.humanTurn = undefined;
    this.history = [];
  }

  private decodeSnapshot(stateData: string): State {
    const parsed = JSON.parse(new Base64().decode(stateData));
    if (!Array.isArray(parsed) || !parsed[1] || !Array.isArray(parsed[1].cardNames)) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    // PrizeMap historically emits plain rules/settings objects. Promote the raw
    // nodes before deserializing so Ref paths retain their shared object identity.
    const promote = (value: any, type: string): any => value && typeof value === 'object'
      && !Array.isArray(value) && value._type === undefined ? { ...value, _type: type } : value;
    parsed[1].rules = promote(parsed[1].rules, 'Rules');
    parsed[1].gameSettings = promote(parsed[1].gameSettings, 'GameSettings');
    if (parsed[1].gameSettings) {
      parsed[1].gameSettings.rules = promote(parsed[1].gameSettings.rules, 'Rules');
    }
    const normalizedNames = new Map<string, string>();
    parsed[1].cardNames = parsed[1].cardNames.map((name: string) => {
      // Exact names preserve print-specific effects; normalization is for external names.
      if (StateSerializer.hasKnownCard(name)) { return name; }
      // Legacy snapshots can contain a damaged accented character. Use the same
      // repair as restoreContext before scanning the catalogue for an alias.
      const repaired = name.replace('�', 'é');
      if (repaired !== name && StateSerializer.hasKnownCard(repaired)) { return repaired; }
      if (!normalizedNames.has(name)) {
        normalizedNames.set(name, StateSerializer.normalizeCardName(name) || name);
      }
      return normalizedNames.get(name)!;
    });
    const state = this.serializer.deserialize(JSON.stringify(parsed));
    if (!(state instanceof State) || !Array.isArray(state.players) || state.players.length !== 2
      || !state.players.every(player => this.validPlayer(player))
      || !state.players.every(player => Number.isSafeInteger(player.id) && player.id >= 0)
      || state.players[0].id === state.players[1].id
      || !(state.rules instanceof Rules)
      || Object.keys(new Rules()).some(key => typeof (state.rules as any)[key] !== 'boolean')
      || (Object.prototype.hasOwnProperty.call(state.rules, 'oldBurnRule')
        && typeof state.rules.oldBurnRule !== 'boolean')
      || (['oneRetreatPerTurn', 'oneStadiumPerTurn', 'allowSameNameStadium'] as const)
        .some(key => Object.prototype.hasOwnProperty.call(state.rules, key) && typeof state.rules[key] !== 'boolean')
      || !Number.isSafeInteger(state.turn) || state.turn < 0
      || !Number.isInteger(state.phase) || state.phase < GamePhase.WAITING_FOR_PLAYERS || state.phase > GamePhase.FINISHED
      || !Array.isArray(state.logs) || state.logs.some(log => !log || typeof log !== 'object')
      || ![0, 1].includes(state.activePlayer)
      || !Array.isArray(state.prompts)
      || state.prompts.some(prompt => prompt.result === undefined)) {
      // Serialized prompts cannot contain their continuation closures. PrizeMap stores
      // snapshots only at stable points, so fail clearly instead of stranding a prompt.
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    return state;
  }

  private validPlayer(player: Player): boolean {
    return player instanceof Player && player.marker instanceof Marker && Array.isArray(player.marker.markers)
      && this.validPokemonList(player.active)
      && Array.isArray(player.bench) && player.bench.every(list => this.validPokemonList(list))
      && Array.isArray(player.prizes) && player.prizes.every(list => this.validCardList(list))
      && [player.deck, player.hand, player.discard, player.lostzone, player.stadium, player.supporter]
        .every(list => this.validCardList(list));
  }

  private validCardList(list: CardList): boolean {
    return list instanceof CardList && Array.isArray(list.cards) && list.cards.every(card => card instanceof Card);
  }

  private validPokemonList(list: PokemonCardList): boolean {
    return list instanceof PokemonCardList && this.validCardList(list)
      && list.marker instanceof Marker && Array.isArray(list.marker.markers)
      && this.validCardList(list.energies)
      && Array.isArray(list.tools) && list.tools.every(card => card instanceof Card)
      && Array.isArray(list.specialConditions) && Array.isArray(list.boardEffect)
      && Number.isFinite(list.damage) && Number.isFinite(list.hpBonus);
  }

  private settle(): void {
    // Resolve engine randomness and default CPU choices locally. Bound bad card loops.
    for (let step = 0; step < 1000; step++) {
      const state = this.state;
      if (state.phase === GamePhase.FINISHED) {
        this.complete = true;
        return;
      }
      const unresolved = state.prompts.filter(prompt => prompt.result === undefined);
      let action: Action | undefined;
      for (const prompt of unresolved) {
        action = this.arbiter.resolvePrompt(state, prompt);
        if (action) { break; }
        if (prompt instanceof WaitPrompt) {
          action = new ResolvePromptAction(prompt.id, null);
          break;
        }
        if (prompt.playerId === this.opponentPlayerId) {
          action = this.resolveOpponentPrompt(prompt);
          if (action) { break; }
        }
      }
      if (action) {
        this.store.state = this.store.dispatch(action, 4);
        continue;
      }
      if (unresolved.length > 0) {
        return;
      }
      // Resolved prompts are never part of a snapshot sent back to PrizeMap.
      state.prompts = [];
      if (this.humanTurn !== undefined && (state.turn !== this.humanTurn || state.activePlayer !== 0)) {
        this.complete = true;
        return;
      }
      if (state.phase === GamePhase.PLAYER_TURN && state.activePlayer === 1) {
        // Some snapshots start on the opponent's turn. The dummy only passes.
        this.store.state = this.store.dispatch(new PassTurnAction(this.opponentPlayerId), 4);
        continue;
      }
      if (state.phase === GamePhase.PLAYER_TURN && state.activePlayer === 0) {
        this.humanTurn = state.turn;
      }
      return;
    }
    throw new Error('Simulator exceeded the automatic action limit.');
  }

  private resolveOpponentPrompt(prompt: Prompt<any>): Action | undefined {
    const state = this.state;
    const opponent = state.players[1];
    for (const resolver of this.resolvers) {
      const action = resolver.resolvePrompt(state, opponent, prompt);
      if (action instanceof ResolvePromptAction && prompt.validate(action.result, state)) {
        return action;
      }
    }
    if (prompt instanceof SelectOptionPrompt) {
      const index = prompt.values.findIndex((_, i) => !prompt.options.disabled?.[i]);
      if (index !== -1) {
        return new ResolvePromptAction(prompt.id, index);
      }
    }
    if (prompt instanceof ShowCardsPrompt || prompt instanceof ConfirmCardsPrompt || prompt instanceof ShowMulliganPrompt) {
      return new ResolvePromptAction(prompt.id, true);
    }
    if (prompt.validate(null, state)) {
      return new ResolvePromptAction(prompt.id, null);
    }
    throw new Error('The dummy opponent cannot resolve prompt: ' + prompt.type);
  }

  private publish(): State {
    for (const player of this.state.players) {
      for (const list of [player.active, ...player.bench]) {
        if (list.getPokemonCard()) {
          this.store.reduceEffect(this.state, new CheckHpEffect(player, list));
          const types = new CheckPokemonTypeEffect(list);
          this.store.reduceEffect(this.state, types);
          list.cardTypes = [...new Set(types.cardTypes)];
        } else {
          delete list.cardTypes;
        }
      }
    }
    this.notify?.(this.state);
    return this.state;
  }
}
