import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from './effects/attack-effects';
import { CheckProvidedEnergyEffect } from './effects/check-effects';
import { mirrorOnlyEnergyForQuery } from './prefabs/mirror-only-energy';
import { StateUtils } from './state-utils';
import { preflightCopiedOpponentAttacks, resolveCopyAttackSessions } from './prefabs/copy-attack-delegation';
import { Action } from './actions/action';
import { AbortGameAction } from './actions/abort-game-action';
import { AppendLogAction } from './actions/append-log-action';
import { ConcedeAction } from './actions/concede-action';
import { Card } from './card/card';
import { PokemonCard } from './card/pokemon-card';
import { TrainerCard } from './card/trainer-card';
import { Stage } from './card/card-types';
import { PowerType } from './card/pokemon-types';
import { PokemonCardList } from './state/pokemon-card-list';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from './actions/play-card-action';
import { ChangeAvatarAction } from './actions/change-avatar-action';
import { Effect } from './effects/effect';
import { clearAttackDamageScopes } from './prefabs/attack-after-damage';
import { AfterEvolveEffect, AttackEffect, CheckEvolveEffect, EvolveEffect, PowerEffect, RetreatEffect, RetreatStartEffect } from './effects/game-effects';
import { ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN } from './prefabs/retreat-lock-until-target-end-turn';
import { MarkerConstants } from './markers/marker-constants';
import { EndTurnEffect } from './effects/game-phase-effects';
import { GameError } from '../game-error';
import { GameMessage, GameLog } from '../game-message';
import { Prompt } from './prompts/prompt';
import { ReorderHandAction, ReorderBenchAction } from './actions/reorder-actions';
import { ResolvePromptAction } from './actions/resolve-prompt-action';
import { State, GamePhase } from './state/state';
import { StateLog, StateLogParam } from './state/state-log';
import { StoreHandler } from './store-handler';
import { StoreLike } from './store-like';
import { generateId, deepClone } from '../../utils/utils';
import { attackReducer } from './effect-reducers/attack-effect';
import { playCardReducer } from './reducers/play-card-reducer';
import { playEnergyReducer } from './effect-reducers/play-energy-effect';
import { playPokemonReducer } from './effect-reducers/play-pokemon-effect';
import { playPokemonFromDeckReducer } from './effect-reducers/play-pokemon-from-deck-effect';
import { playPokemonFromDiscardReducer } from './effect-reducers/play-pokemon-from-discard-effect';
import { playTrainerReducer, preflightDualStadiumCancellation } from './effect-reducers/play-trainer-effect';
import { playerTurnReducer } from './reducers/player-turn-reducer';
import { gamePhaseReducer } from './effect-reducers/game-phase-effect';
import { gameReducer } from './effect-reducers/game-effect';
import { checkBenchSize, checkState, checkStateReducer } from './effect-reducers/check-effect';
import { playerStateReducer } from './reducers/player-state-reducer';
import { retreatReducer } from './effect-reducers/retreat-effect';
import { setupPhaseReducer } from './reducers/setup-reducer';
import { abortGameReducer } from './reducers/abort-game-reducer';
import { concedeReducer } from './reducers/concede-reducer';
import { sandboxReducer } from './reducers/sandbox-reducer';
import { SandboxModifyPlayerAction } from './actions/sandbox-modify-player-action';
import { SandboxModifyGameStateAction } from './actions/sandbox-modify-game-state-action';
import { SandboxModifyCardAction } from './actions/sandbox-modify-card-action';
import { SandboxModifyPokemonAction } from './actions/sandbox-modify-pokemon-action';

interface PromptItem {
  ids: number[],
  then: (results: any) => void;
}

export class Store implements StoreLike {

  //private effectHistory: Effect[] = [];

  public state: State = new State();
  private promptItems: PromptItem[] = [];
  private waitItems: (() => void)[] = [];
  private logId: number = 0;
  // Flag to prevent nested playability calculations
  private calculatingPlayability: boolean = false;

  constructor(private handler: StoreHandler) { }

  /** Restore a stable snapshot without retaining callbacks from the previous game. */
  public restoreState(state: State): void {
    clearAttackDamageScopes(this.state);
    if (this.state !== state) clearAttackDamageScopes(state);
    this.promptItems = [];
    this.waitItems = [];
    this.logId = state.logs.reduce((max, log) => Math.max(max, log.id || 0), 0);
    this.state = state;
    // Snapshots may carry the default five slots even with a bench-expanding
    // effect already in play. Rebuild capacity before deriving playable cards.
    // The state-check guard belongs to the old execution, not the restored game.
    state.benchSizeChangeHandled = false;
    if ([GamePhase.PLAYER_TURN, GamePhase.ATTACK, GamePhase.BETWEEN_TURNS].includes(state.phase)) {
      checkBenchSize(this, state);
      state.benchSizeChangeHandled = false;
    }
    this.state = this.calculatePlayability(state);
  }

  public dispatch(action: Action, clientRoleId?: number): State {
    let state = this.state;

    // Handle sandbox actions
    if (action instanceof SandboxModifyPlayerAction
      || action instanceof SandboxModifyGameStateAction
      || action instanceof SandboxModifyCardAction
      || action instanceof SandboxModifyPokemonAction) {
      if (clientRoleId === undefined) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      state = sandboxReducer(this, state, action, clientRoleId);
      state = this.calculatePlayability(state);
      this.handler.onStateChange(state);
      return state;
    }

    if (action instanceof AbortGameAction) {
      state = abortGameReducer(this, state, action);
      state = this.calculatePlayability(state);
      this.handler.onStateChange(state);
      return state;
    }

    if (action instanceof ConcedeAction) {
      state = concedeReducer(this, state, action);
      state = this.calculatePlayability(state);
      this.handler.onStateChange(state);
      return state;
    }

    if (action instanceof ReorderHandAction
      || action instanceof ReorderBenchAction
      || action instanceof ChangeAvatarAction) {
      state = playerStateReducer(this, state, action);
      state = this.calculatePlayability(state);
      this.handler.onStateChange(state);
      return state;
    }

    if (action instanceof ResolvePromptAction) {
      state = this.reducePrompt(state, action);
      if (this.promptItems.length === 0) {
        state = checkState(this, state);
      }
      state = this.calculatePlayability(state);
      this.handler.onStateChange(state);
      return state;
    }

    if (action instanceof AppendLogAction) {
      this.log(state, action.message, action.params, action.id);
      this.handler.onStateChange(state);
      return state;
    }

    if (state.prompts.some(p => p.result === undefined)) {
      throw new GameError(GameMessage.ACTION_IN_PROGRESS);
    }

    state = this.reduce(state, action);

    return state;
  }

  public reduceEffect(state: State, effect: Effect): State {
    const preflight = preflightDualStadiumCancellation(this, state, effect);
    if (preflight !== undefined) return preflight;
    // A completed attack's retreat lock belongs to the affected Pokémon,
    // independent of whether its attacker is still in any visible zone.
    if ((effect instanceof RetreatStartEffect || effect instanceof RetreatEffect)
      && effect.player.active.marker.hasMarker(ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }
    if (effect instanceof EvolveEffect) {
      // Reject invalid targets and current restrictions before any on-evolve
      // handlers can alter damage, prompts, markers, or card zones.
      if (!effect.target.getPokemonCard()) throw new GameError(GameMessage.INVALID_TARGET);
      if (!effect.source.cards.includes(effect.pokemonCard)
        && effect.target.getPokemonCard() !== effect.pokemonCard) throw new GameError(GameMessage.INVALID_TARGET);
      // The legacy reducer fan-out is not read-only: some cards react even to
      // unrelated events. Check on a fully isolated clone so a rejected move
      // cannot leave prompts, markers or damage on the live state.
      const references: {s: Object, d: Object}[] = [];
      const isolatedState: State = deepClone(state, [], references);
      const cloned = <T extends Object>(value: T): T => {
        const match = references.find(entry => entry.s === value);
        if (!match) throw new GameError(GameMessage.INVALID_TARGET);
        return match.d as T;
      };
      // Card-specific Trainer overrides use the handler's format, so preserve
      // it (and any other game settings) in the isolated handler as well.
      const settings = (this.handler as any).gameSettings;
      const isolatedSettings = settings && typeof settings === 'object'
        ? deepClone(settings, [], references) : settings;
      const isolatedHandler: StoreHandler & {gameSettings?: unknown, format?: unknown} = {
        onStateChange: () => undefined,
        gameSettings: isolatedSettings,
        format: (this.handler as any).format
      };
      const isolatedStore = new Store(isolatedHandler);
      isolatedStore.state = isolatedState;
      const preflight = new CheckEvolveEffect(cloned(effect.player), cloned(effect.target), cloned(effect.pokemonCard), cloned(effect.source), effect.playedFromHand);
      try {
        isolatedStore.reduceEffect(isolatedState, preflight);
      } finally {
        isolatedStore.cleanup();
      }
      // Every legacy EvolveEffect caller expects rejection to throw; a silent
      // cancellation could let the caller apply follow-up effects to a
      // Pokémon that did not evolve.
      if (preflight.preventDefault) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      effect.preflightComplete = true;
    }
    if (effect instanceof PowerEffect && !effect.preventDefault
      && [PowerType.POKEPOWER, PowerType.POKEBODY, PowerType.POKEMON_POWER].includes(effect.power.powerType)) {
      const cardList = effect.target ?? StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList && cardList.cannotUsePowersNextTurn) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }
    // Clear Vision affects the player for the rest of the game, even if the
    // Pokémon that used or copied it has since left play. Reject the attack
    // before any card handler can perform attack side effects.
    if (effect instanceof AttackEffect && !effect.preventDefault && effect.attack
      && effect.player.marker.hasMarker(MarkerConstants.CLEAR_VISION_GX_LOCK)
      && (effect.attack.gxAttack === true ||
        (typeof effect.attack.name === 'string' && effect.attack.name.includes('-GX')))) {
      throw new GameError(GameMessage.CANNOT_USE_ATTACK);
    }
    if (effect instanceof AttackEffect && !effect.preventDefault) {
      state = preflightCopiedOpponentAttacks(this, state, effect);
    }
    // Upstream attack prevention runs before fan-out so blocked effects never trigger cards.
    if (effect instanceof AbstractAttackEffect && effect.target && effect.source
      && (effect.target.preventDamageNextTurn || effect.target.preventEffectsOfAttacksNextTurn)) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const sourceOwner = StateUtils.findOwner(state, effect.source);
      if (targetOwner !== sourceOwner) {
        const damage = effect instanceof PutDamageEffect || effect instanceof DealDamageEffect;
        const nonDamage = !damage && !(effect instanceof ApplyWeaknessEffect);
        if ((damage && effect.target.preventDamageNextTurn)
          || (nonDamage && effect.target.preventEffectsOfAttacksNextTurn)) {
          effect.preventDefault = true;
          return state;
        }
      }
    }

    // Attacking-player marker boosts are resolved before defending Pokémon's
    // damage reducers, regardless of card traversal order.
    if (effect instanceof DealDamageEffect && !effect.preventDefault) {
      state = this.propagatePlayerMarkerEffect(state, effect);
    }
    state = this.propagateEffect(state, effect);
    state = resolveCopyAttackSessions(this, state, effect);

    if (effect.preventDefault === true) {
      return state;
    }

    // Expire player-scoped effects only after an end turn is accepted.
    if (effect instanceof EndTurnEffect) {
      state = this.propagatePlayerMarkerEffect(state, effect);
      if (effect.preventDefault) return state;
    }

    state = gamePhaseReducer(this, state, effect);
    state = playEnergyReducer(this, state, effect);
    state = playPokemonReducer(this, state, effect);
    state = playPokemonFromDeckReducer(this, state, effect);
    state = playPokemonFromDiscardReducer(this, state, effect);
    state = playTrainerReducer(this, state, effect);
    state = retreatReducer(this, state, effect);
    state = gameReducer(this, state, effect);
    state = attackReducer(this, state, effect);
    state = checkStateReducer(this, state, effect);

    // Only signal a successful evolution after every existing blocker has
    // accepted it. Its evolved Pokémon is now in play for Ability checks.
    if (effect instanceof EvolveEffect && !effect.preventDefault && effect.target.getPokemonCard() === effect.pokemonCard) {
      state = this.reduceEffect(state, new AfterEvolveEffect(effect.player, effect.target, effect.pokemonCard, effect.playedFromHand));
    }

    // Effects include nested reducers and read-only HP/type queries. Derive
    // playable-card hints once at restore/dispatch boundaries, after the state
    // settles, rather than cloning the whole game after every internal effect.
    return state;
  }

  compareEffects(effect1: Effect, effect2: Effect): boolean {
    if (effect1.type !== effect2.type) {
      return false;
    }

    const effect1CardId = (<any>effect1)?.card?.id;
    const effect2CardId = (<any>effect2)?.card?.id;

    const effect1CardPlayerId = (<any>effect1)?.player?.id;
    const effect2CardPlayerId = (<any>effect2)?.player?.id;

    return effect1CardId === effect2CardId &&
      effect1CardPlayerId === effect2CardPlayerId;
  }

  public prompt(state: State, prompts: Prompt<any>[] | Prompt<any>, then: (results: any) => void): State {
    if (!(prompts instanceof Array)) {
      prompts = [prompts];
    }

    for (let i = 0; i < prompts.length; i++) {
      const id = generateId(state.prompts);
      prompts[i].id = id;
      state.prompts.push(prompts[i]);
    }

    const promptItem: PromptItem = {
      ids: prompts.map(prompt => prompt.id),
      then: then
    };

    this.promptItems.push(promptItem);
    return state;
  }

  public waitPrompt(state: State, callback: () => void): State {
    this.waitItems.push(callback);
    return state;
  }

  public log(state: State, message: GameLog, params?: StateLogParam, client?: number): void {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).toString();

    const log = new StateLog(message, params, client);
    log.params = { ...params, timestamp };
    log.id = ++this.logId;
    state.logs.push(log);
  }

  private reducePrompt(state: State, action: ResolvePromptAction): State {
    // Resolve prompts actions
    const prompt = state.prompts.find(item => item.id === action.id);
    const promptItem = this.promptItems.find(item => item.ids.indexOf(action.id) !== -1);

    if (prompt === undefined || promptItem === undefined) {
      return state;
    }

    if (prompt.result !== undefined) {
      throw new GameError(GameMessage.PROMPT_ALREADY_RESOLVED);
    }

    try {
      prompt.result = action.result;

      const results = promptItem.ids.map(id => {
        const p = state.prompts.find(item => item.id === id);
        return p === undefined ? undefined : p.result;
      });

      if (action.log !== undefined) {
        this.log(state, action.log.message, action.log.params, action.log.client);
      }

      if (results.every(result => result !== undefined)) {
        const itemIndex = this.promptItems.indexOf(promptItem);
        promptItem.then(results.length === 1 ? results[0] : results);
        this.promptItems.splice(itemIndex, 1);
      }

      this.resolveWaitItems();
    } catch (storeError) {
      // Illegal action
      prompt.result = undefined;
      throw storeError;
    }

    return state;
  }

  private resolveWaitItems(): void {
    while (this.promptItems.length === 0 && this.waitItems.length > 0) {
      const waitItem = this.waitItems.pop();
      if (waitItem !== undefined) {
        waitItem();
      }
    }
  }

  public hasPrompts(): boolean {
    return this.promptItems.length > 0;
  }

  public cleanup(): void {
    clearAttackDamageScopes(this.state);
    this.promptItems = [];
    this.waitItems = [];
    this.logId = 0;
    this.state = new State();
  }

  private reduce(state: State, action: Action): State {
    const stateBackup = deepClone(state, [Card]);
    this.promptItems.length = 0;

    try {
      state = setupPhaseReducer(this, state, action);
      state = playCardReducer(this, state, action);
      state = playerTurnReducer(this, state, action);

      this.resolveWaitItems();
      if (this.promptItems.length === 0) {
        state = checkState(this, state);
      }

      // Calculate playability before state change
      state = this.calculatePlayability(state);
    } catch (storeError) {
      // Illegal action
      this.state = stateBackup;
      this.promptItems.length = 0;
      throw storeError;
    }

    this.handler.onStateChange(state);
    return state;
  }

  private calculatePlayability(state: State): State {
    // Prevent nested calls - if we're already calculating playability, skip
    if (this.calculatingPlayability) {
      return state;
    }

    // Skip playability calculation during setup and other non-play phases
    // Only calculate starting from Turn 1 (skip Turn 0 which is setup)
    if (state.phase !== GamePhase.PLAYER_TURN || state.turn < 1) {
      // Clear playability for all players when not in player turn or during setup
      for (const player of state.players) {
        player.playableCardIds = [];
      }
      return state;
    }

    // Skip if players aren't set up yet
    if (!state.players || state.players.length === 0) {
      return state;
    }

    // Set flag to prevent nested calls
    this.calculatingPlayability = true;

    // Track prompts before playability check to clean up any created during checks
    const promptItemsBefore = this.promptItems.length;
    const waitItemsBefore = this.waitItems.length;

    try {
      const { CAN_PLAY_CARD } = require('./prefabs/prefabs');

      for (const player of state.players) {
        // Clear previous playability
        player.playableCardIds = [];

        // Only calculate for the active player
        if (state.players[state.activePlayer]?.id !== player.id) {
          continue;
        }

        // Check each card in hand
        for (const [handIndex, card] of player.hand.cards.entries()) {
          try {
            // Skip cards without valid IDs (shouldn't happen, but safety check)
            if (card.id === undefined || card.id === -1) {
              continue;
            }

            // Trainer checks and evolution checks can run arbitrary card
            // effects. Keep those probes off the live board; some legacy
            // handlers react to query effects by adding markers or prompts.
            const needsIsolation = card instanceof TrainerCard
              || (card instanceof PokemonCard && card.stage !== Stage.BASIC);
            const canPlay = needsIsolation
              ? this.checkCardHint(state, player.id, handIndex, CAN_PLAY_CARD)
              : CAN_PLAY_CARD(this, state, player, card);
            if (canPlay) {
              player.playableCardIds.push(card.id);
            }
          } catch (error) {
            // If check fails, card is not playable - silently continue
          }
        }
      }
    } catch (error) {
      // If playability calculation fails entirely, just clear all and continue
      // This prevents setup from breaking
      for (const player of state.players) {
        player.playableCardIds = [];
      }
    } finally {
      // Clean up any prompts or wait items that were created during playability checks
      // These are fake prompts from testing card playability and should not interfere with real game prompts
      if (this.promptItems.length > promptItemsBefore) {
        this.promptItems.splice(promptItemsBefore, this.promptItems.length - promptItemsBefore);
      }
      if (this.waitItems.length > waitItemsBefore) {
        this.waitItems.splice(waitItemsBefore, this.waitItems.length - waitItemsBefore);
      }
      // Always clear the flag, even if an error occurred
      this.calculatingPlayability = false;
    }

    return state;
  }

  private checkCardHint(
    state: State,
    playerId: number,
    handIndex: number,
    canPlayCard: typeof import('./prefabs/prefabs').CAN_PLAY_CARD,
  ): boolean {
    const copy: State = deepClone(state);
    const player = copy.players.find(item => item.id === playerId);
    const card = player?.hand.cards[handIndex];
    if (!player || !card) return false;
    const probe = this.createPlayabilityProbe(copy, state);
    try {
      if (canPlayCard(probe, copy, player, card,
        () => this.checkTrainerPlay(state, playerId, handIndex))) return true;
      if (card instanceof PokemonCard && card.powers.some(power => power.useFromHand && power.useFromHandToBench)) {
        const index = player.bench.findIndex(slot => slot.cards.length === 0);
        if (index < 0) return false;
        try {
          playCardReducer(probe, copy, new PlayCardAction(playerId, handIndex,
            { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index }));
          return player.bench[index].cards.includes(card);
        } catch { return false; }
      }
      return false;
    } finally {
      probe.cleanup();
    }
  }

  private createPlayabilityProbe(state: State, original: State): Store {
    // The same format-specific Trainer overrides apply in a hint and in an
    // actual action. Clone handler settings so probes cannot mutate them.
    const settings = (this.handler as any).gameSettings;
    const handler = {
      gameSettings: settings === original.gameSettings ? state.gameSettings
        : settings && typeof settings === 'object' ? deepClone(settings) : settings,
      format: (this.handler as any).format,
      onStateChange: () => {}
    };
    const probe = new Store(handler);
    probe.state = state;
    probe.calculatingPlayability = true;
    return probe;
  }

  private checkTrainerPlay(state: State, playerId: number, handIndex: number): boolean {
    const player = state.players.find(item => item.id === playerId);
    if (!player) { return false; }
    const targets: CardTarget[] = [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, _card, target) => targets.push(target));

    for (const target of targets) {
      // Clone cards too: Trainers can move cards, set markers, or open prompts
      // before returning. All of those changes belong only to this probe.
      const copy: State = deepClone(state);
      const probe = this.createPlayabilityProbe(copy, state);
      try {
        playCardReducer(probe, copy, new PlayCardAction(playerId, handIndex, target));
        return true;
      } catch {
        // Some Trainers require a specific Pokemon target rather than the board.
      } finally {
        probe.cleanup();
      }
    }
    return false;
  }

  private propagatePlayerMarkerEffect(state: State, effect: Effect): State {
    for (const owner of state.players) {
      if (owner.marker.markers.length === 0) continue;
      for (const marker of owner.marker.markers.slice()) {
        const source = marker.source;
        if (source && source.reducePlayerMarkerEffect) {
          state = source.reducePlayerMarkerEffect(this, state, effect, owner, marker);
        }
        if (effect.preventDefault) return state;
      }
    }
    return state;
  }

  private propagateEffect(state: State, effect: Effect): State {
    const cards: Card[] = [];
    const virtual = new Set(effect instanceof CheckProvidedEnergyEffect ? mirrorOnlyEnergyForQuery(state, effect) : []);
    for (const player of state.players) {
      player.stadium.cards.forEach(c => cards.push(c));
      player.supporter.cards.forEach(c => cards.push(c));
      player.active.cards.forEach(c => cards.push(c));
      if (effect instanceof CheckProvidedEnergyEffect && effect.source === player.active) virtual.forEach(c => cards.push(c));
      player.active.tools.forEach(t => cards.push(t));
      for (const bench of player.bench) {
        bench.cards.forEach(c => cards.push(c));
        if (effect instanceof CheckProvidedEnergyEffect && effect.source === bench) virtual.forEach(c => cards.push(c));
        bench.tools.forEach(t => cards.push(t));
      }
      for (const prize of player.prizes) {
        prize.cards.forEach(c => cards.push(c));
      }
      player.hand.cards.forEach(c => cards.push(c));
      player.deck.cards.forEach(c => cards.push(c));
      player.discard.cards.forEach(c => cards.push(c));
    }
    cards.sort(c => c.superType);
    cards.forEach(c => {
      if (virtual.has(c) && effect instanceof CheckProvidedEnergyEffect) {
        state = (c as Card & { reduceMirrorOnlyEnergyEffect: (store: StoreLike, state: State, effect: CheckProvidedEnergyEffect) => State }).reduceMirrorOnlyEnergyEffect(this, state, effect);
      } else state = this.callReduceEffect(c, this, state, effect);
    });
    return state;
  }

  // Utility function to call reduceEffect with override support
  private callReduceEffect(card: Card, store: StoreLike, state: State, effect: Effect): State {
    // Only try override for TrainerCard (for now)
    if ((card as any).trainerType !== undefined) {
      // Import here to avoid circular dependency at module level
      const { getOverriddenReduceEffect } = require('./card/card-effect-overrides');
      const format = (store as any)?.handler?.gameSettings?.format ?? 0;
      const override = getOverriddenReduceEffect(card, format);
      if (override) {
        return override(store, state, effect);
      }
    }
    return card.reduceEffect(store, state, effect);
  }
}
