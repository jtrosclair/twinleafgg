import { AddPlayerAction } from '../store/actions/add-player-action';
import { CleanerTask } from '../tasks/cleaner-task';
import { Client } from '../client/client.interface';
import { GameError } from '../game-error';
import { GameMessage, GameCoreError } from '../game-message';
import { Game } from './game';
import { GameSettings } from './game-settings';
import { InvitePlayerAction } from '../store/actions/invite-player-action';
import { Messager } from './messager';
import { RankingCalculator } from './ranking-calculator';
import { Scheduler, generateId } from '../../utils';
import { config } from '../../config';
import { Format } from '../store/card/card-types';
import { AbortGameAction } from '../store/actions/abort-game-action';
import { AbortGameReason } from '../store/actions/abort-game-action';
import { GamePhase, State } from '../store/state/state';
import { BotManager } from '../bots/bot-manager';
import { ReconnectionManager } from '../../backend/services/reconnection-manager';
import { ReconnectionConfig } from '../../backend/interfaces/reconnection.interface';
import { logger } from '../../utils/logger';
import { User } from '../../storage';
import { deepClone } from '../../utils/utils';

export class Core {
  public clients: Client[] = [];
  public games: Game[] = [];
  public messager: Messager;
  private botManager: BotManager;
  private reconnectionManager: ReconnectionManager;

  constructor(reconnectionConfig?: ReconnectionConfig) {
    this.messager = new Messager(this);
    this.botManager = BotManager.getInstance();

    // Initialize reconnection manager with default config if not provided
    const defaultConfig: ReconnectionConfig = {
      preservationTimeoutMs: 5 * 60 * 1000, // 5 minutes
      maxAutoReconnectAttempts: 3,
      reconnectIntervals: [5000, 10000, 15000],
      healthCheckIntervalMs: 30 * 1000,
      cleanupIntervalMs: 5 * 60 * 1000,
      maxPreservedSessionsPerUser: 1
    };
    this.reconnectionManager = new ReconnectionManager(reconnectionConfig || defaultConfig);

    const cleanerTask = new CleanerTask(this);
    cleanerTask.startTasks();
    //this.startRankingDecrease();
    this.startInactiveGameCleanup();
  }

  public getBotManager(): BotManager {
    return this.botManager;
  }

  public getReconnectionManager(): ReconnectionManager {
    return this.reconnectionManager;
  }

  public async connect(client: Client): Promise<Client> {
    if (client.id === 0 || this.clients.some(c => c.id === client.id)) {
      client.id = generateId(this.clients);
    }
    client.core = this;
    client.games = [];

    // Add client to the core
    this.clients.push(client);

    // Emit connection events to notify other clients
    this.emit(c => c.onConnect(client));

    // Send updated user list to all clients to show the new user as online
    this.broadcastUserUpdates();

    return client;
  }

  public async disconnect(client: Client, reason: string = 'unknown'): Promise<void> {
    const index = this.clients.indexOf(client);
    if (index === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }

    // Handle disconnection for all games without removing them
    client.games.forEach(game => {
      const isPlayer = game.state.players.some(player => player.id === client.id);
      if (isPlayer) {
        game.handlePlayerDisconnection(client);
        return;
      }

      const gameClientIndex = game.clients.indexOf(client);
      if (gameClientIndex !== -1) {
        game.clients.splice(gameClientIndex, 1);
        this.emit(c => c.onGameLeave(game, client));
      }
    });
    client.games = [];

    // Remove client from core
    this.clients.splice(index, 1);
    client.core = undefined;

    // Notify other clients
    this.emit(c => c.onDisconnect(client));

    // Send updated user list to all clients to show the user as offline
    this.broadcastUserUpdates();
  }

  public createGame(
    client: Client,
    deck: string[],
    gameSettings: GameSettings = new GameSettings(),
    invited?: Client,
    deckId1?: number,
    deckId2?: number
  ): Game {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (invited && this.clients.indexOf(invited) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }

    // Check if either client is a bot with format restrictions
    if (invited && this.isBotClient(invited)) {
      const botClient = invited as any; // Cast to access bot-specific methods
      if (!botClient.isFormatAllowed(gameSettings.format)) {
        throw new GameError(GameCoreError.ERROR_BOT_FORMAT_NOT_ALLOWED);
      }
    }

    if (this.isBotClient(client)) {
      const botClient = client as any; // Cast to access bot-specific methods
      if (!botClient.isFormatAllowed(gameSettings.format)) {
        throw new GameError(GameCoreError.ERROR_BOT_FORMAT_NOT_ALLOWED);
      }
    }
    if (gameSettings.format === Format.RETRO) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = false;
    }
    if (gameSettings.format === Format.RSPK) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = false;
    }
    if (gameSettings.format === Format.BW) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = true;
      gameSettings.rules.firstTurnUseSupporter = true;
    }
    const game = new Game(this, generateId(this.games), gameSettings);
    game.dispatch(client, new AddPlayerAction(client.id, client.name, deck, undefined, deckId1));
    if (invited) {
      game.dispatch(client, new InvitePlayerAction(invited.id, invited.name));
    }
    this.games.push(game);
    this.emit(c => c.onGameAdd(game));
    this.joinGame(client, game);
    if (invited) {
      this.joinGame(invited, game);
    }
    return game;
  }

  public createGameWithDecks(
    client: Client,
    deck: string[],
    gameSettings: GameSettings = new GameSettings(),
    client2: Client,
    deck2: string[],
    artworksMap1?: { [code: string]: { imageUrl: string; holoType?: string } },
    artworksMap2?: { [code: string]: { imageUrl: string; holoType?: string } },
    deckId1?: number,
    deckId2?: number
  ): Game {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (this.clients.indexOf(client2) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }

    console.log(`[Matchmaking] Match created between ${client.name} and ${client2.name} (Format: ${gameSettings.format})`);
    if (gameSettings.format === Format.RETRO) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = false;
    }
    if (gameSettings.format === Format.RSPK) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = false;
    }
    if (gameSettings.format === Format.BW) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = true;
      gameSettings.rules.firstTurnUseSupporter = true;
    }
    const game = new Game(this, generateId(this.games), gameSettings);
    game.dispatch(client, new AddPlayerAction(client.id, client.name, deck, artworksMap1, deckId1));
    game.dispatch(client, new AddPlayerAction(client2.id, client2.name, deck2, artworksMap2, deckId2));
    this.games.push(game);
    this.emit(c => c.onGameAdd(game));
    this.joinGame(client, game);
    this.joinGame(client2, game);
    return game;
  }

  public joinGame(client: Client, game: Game): void {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (this.games.indexOf(game) === -1) {
      throw new GameError(GameMessage.ERROR_GAME_NOT_FOUND);
    }
    if (client.games.indexOf(game) === -1) {
      this.emit(c => c.onGameJoin(game, client));
      client.games.push(game);
      game.clients.push(client);
      game.registerPlayer(client);

      // Join Socket.IO room for game-specific messages
      const socketClient = client as any;
      if (socketClient && socketClient.socket && socketClient.socket.socket) {
        const socket = socketClient.socket.socket;
        const roomName = `game[${game.id}]`;
        socket.join(roomName);
      }
    }
  }

  public deleteGame(game: Game): void {
    game.clients.forEach(client => {
      const index = client.games.indexOf(game);
      if (index !== -1) {
        client.games.splice(index, 1);
        this.emit(c => c.onGameLeave(game, client));
      }
    });
    const index = this.games.indexOf(game);
    if (index !== -1) {
      this.games.splice(index, 1);
      this.emit(c => c.onGameDelete(game));
    }
  }

  public leaveGame(client: Client, game: Game): void {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (this.games.indexOf(game) === -1) {
      throw new GameError(GameMessage.ERROR_GAME_NOT_FOUND);
    }
    const gameIndex = client.games.indexOf(game);
    const clientIndex = game.clients.indexOf(client);
    if (clientIndex !== -1 && gameIndex !== -1) {
      client.games.splice(gameIndex, 1);
      game.clients.splice(clientIndex, 1);
      this.emit(c => c.onGameLeave(game, client));
      game.handleClientLeave(client);

      // Leave Socket.IO room for game-specific messages
      const socketClient = client as any;
      if (socketClient && socketClient.socket && socketClient.socket.socket) {
        const socket = socketClient.socket.socket;
        const roomName = `game[${game.id}]`;
        socket.leave(roomName);
      }
    }
    if (game.clients.length === 0) {
      this.deleteGame(game);
    }
  }

  public emit(fn: (client: Client) => void): void {
    this.clients.forEach(fn);
  }

  /**
   * Emit an event to all clients in a specific game using Socket.IO rooms
   */
  public emitToGame(gameId: number, event: string, data: any): void {
    const game = this.games.find(g => g.id === gameId);
    if (game && game.clients.length > 0) {
      // Get the socket.io server from the first client
      const firstClient = game.clients[0] as any;
      if (firstClient && firstClient.socket && firstClient.socket.io) {
        const io = firstClient.socket.io;
        const roomName = `game[${gameId}]`;
        io.to(roomName).emit(event, data);
      }
    }
  }

  /**
   * Broadcast user updates to all connected clients
   */
  private broadcastUserUpdates(): void {
    // Get all unique users from connected clients
    const userIds = new Set(this.clients.map(c => c.user.id));
    const users = Array.from(userIds).map(userId => {
      const client = this.clients.find(c => c.user.id === userId);
      return client ? client.user : null;
    }).filter((user): user is User => user !== null);

    // Emit user updates to all clients
    this.emit(c => c.onUsersUpdate(users));
  }

  private startRankingDecrease() {
    const scheduler = Scheduler.getInstance();
    const rankingCalculator = new RankingCalculator();
    scheduler.run(async () => {
      let users = await rankingCalculator.decreaseRanking();

      // Notify only about users which are currently connected
      const connectedUserIds = this.clients.map(c => c.user.id);
      users = users.filter(u => connectedUserIds.includes(u.id));

      this.emit(c => c.onUsersUpdate(users));
    }, config.core.rankingDecreaseIntervalCount);
  }

  private inactiveGameCleanupInterval: NodeJS.Timeout | undefined;

  private startInactiveGameCleanup(): void {
    const cleanupIntervalMs = 10 * 60 * 1000; // 10 minutes
    this.inactiveGameCleanupInterval = setInterval(async () => {
      console.log("startInactiveCleanup")
      const inactiveTimeout = 10 * 60 * 1000; // 10 minutes

      // Collect games to clean up first to avoid modifying array during iteration
      const gamesToCleanup: Game[] = [];

      for (const game of this.games) {
        if (game.isInactive(inactiveTimeout)) {
          console.log(`[Game Cleanup] Checking inactive game ${game.id} (last activity: ${Math.round((Date.now() - game.getLastActivity()) / 1000)}s ago)`);

          // Check if this game has preserved sessions before cleaning up
          try {
            const activeSessions = await this.reconnectionManager.getActiveDisconnectedSessions();
            const gameHasPreservedSessions = activeSessions.some(session => session.gameId === game.id);

            if (gameHasPreservedSessions) {
              console.log(`[Game Cleanup] Skipping cleanup of game ${game.id} - has preserved sessions`);
              continue;
            }
          } catch (error) {
            console.log(`[Game Cleanup] Error checking preserved sessions for game ${game.id}: ${error}`);
            // If we can't check, skip cleanup to be safe
            continue;
          }

          gamesToCleanup.push(game);
        }
      }

      // Now clean up the collected games
      for (const game of gamesToCleanup) {
        console.log(`[Game Cleanup] Cleaning up inactive game ${game.id}`);
        // Force end the game
        const state = game.state;
        if (state.phase !== GamePhase.FINISHED) {
          state.players.forEach(player => {
            const action = new AbortGameAction(player.id, AbortGameReason.DISCONNECTED);
            // Use the first client as the source for the abort action
            if (game.clients.length > 0) {
              game.dispatch(game.clients[0], action);
            }
          });
        }
        game.cleanup();
        this.deleteGame(game);
      }

      if (gamesToCleanup.length > 0) {
        console.log(`[Game Cleanup] Cleaned up ${gamesToCleanup.length} inactive games. Active games: ${this.games.length}`);
      }
    }, cleanupIntervalMs);
  }

  /**
   * Dispose of the Core and cleanup resources
   */
  public dispose(): void {
    if (this.inactiveGameCleanupInterval) {
      clearInterval(this.inactiveGameCleanupInterval);
      this.inactiveGameCleanupInterval = undefined;
    }
    if (this.reconnectionManager) {
      this.reconnectionManager.dispose();
    }
    logger.log('[Core] Disposed');
  }

  private isBotClient(client: Client): boolean {
    // Check if the client has bot-specific methods
    return 'isFormatAllowed' in client && 'getAllowedFormats' in client;
  }

  /**
   * Creates a game initialized with a specific state.
   * Used for sandbox/viewer mode where a game state is loaded from base64.
   * The client will be assigned as the active player.
   */
  public createGameFromState(
    client: Client,
    state: State,
    gameSettings: GameSettings = new GameSettings(),
    opponentClient?: Client
  ): Game {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (opponentClient && this.clients.indexOf(opponentClient) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }

    // Enable sandbox mode for state-loaded games
    gameSettings.sandboxMode = true;

    // Create a new game
    const game = new Game(this, generateId(this.games), gameSettings);

    // Clone and set the state directly
    const clonedState = deepClone(state);

    // Update player IDs to match the clients
    // The human player is always players[0] (bottom of screen on client)
    // The opponent (bot) is always players[1] (top of screen on client)
    if (clonedState.players[0]) {
      clonedState.players[0].id = client.id;
      clonedState.players[0].name = client.name;
    }

    // If opponent client provided, update the opponent player's ID
    if (opponentClient && clonedState.players[1]) {
      clonedState.players[1].id = opponentClient.id;
      clonedState.players[1].name = opponentClient.name;
    }

    // Set the state on the game's store
    game.getStore().state = clonedState;

    // Initialize player stats for timer
    clonedState.players.forEach((player: any) => {
      player.usedSquawkAndSeizeThisTurn = false;
      game.playerStats.push({
        clientId: player.id,
        isTimeRunning: false,
        invalidMoves: 0,
        timeLeft: gameSettings.timeLimit
      });
    });

    // Add game to core
    this.games.push(game);
    this.emit(c => c.onGameAdd(game));

    // Join the client to the game
    this.joinGame(client, game);

    // Join the opponent client to the game if provided
    if (opponentClient) {
      this.joinGame(opponentClient, game);
    }

    // Trigger state change to notify clients
    game.onStateChange(clonedState);

    return game;
  }

}