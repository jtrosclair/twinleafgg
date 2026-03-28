import { GameSettings, StateSerializer } from '../../game';
import { Client } from '../../game/client/client.interface';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { User } from '../../storage';
import { Core } from '../../game/core/core';
import { CoreInfo, GameInfo, PlayerInfo, GameState, UserInfo } from '../interfaces/core.interface';
import { SocketCache } from './socket-cache';
import { SocketWrapper, Response } from './socket-wrapper';
import { deepCompare } from '../../utils/utils';
import { Base64 } from '../../utils';
import { ApiErrorEnum } from '../common/errors';
import { BotClient } from '../../game/bots/bot-client';

export class CoreSocket {

  private client: Client;
  private socket: SocketWrapper;
  private core: Core;
  private cache: SocketCache;

  constructor(client: Client, socket: SocketWrapper, core: Core, cache: SocketCache) {
    this.cache = cache;
    this.client = client;
    this.socket = socket;
    this.core = core;

    // core listeners
    this.socket.addListener('core:getInfo', this.getCoreInfo.bind(this));
    this.socket.addListener('core:createGame', this.createGame.bind(this));
    this.socket.addListener('core:createGameFromState', this.createGameFromState.bind(this));
  }

  public onConnect(client: Client): void {
    return
    this.socket.emit('core:join', {
      clientId: client.id,
      user: CoreSocket.buildUserInfo(client.user)
    });
  }

  public onDisconnect(client: Client): void {
    return
    this.socket.emit('core:leave', client.id);
  }

  public onGameAdd(game: Game): void {
    return;
    this.cache.lastLogIdCache[game.id] = 0;
    this.cache.gameInfoCache[game.id] = CoreSocket.buildGameInfo(game);
    this.socket.emit('core:createGame', this.cache.gameInfoCache[game.id]);
  }

  public onGameDelete(game: Game): void {
    delete this.cache.gameInfoCache[game.id];
    delete this.cache.lastLogIdCache[game.id];
    this.socket.emit('core:deleteGame', game.id);
  }

  public onStateChange(game: Game, state: State): void {
    return;
    const gameInfo = CoreSocket.buildGameInfo(game);
    if (!deepCompare(gameInfo, this.cache.gameInfoCache[game.id])) {
      this.cache.gameInfoCache[game.id] = gameInfo;
      this.socket.emit('core:gameInfo', gameInfo);
    }
  }

  public onUsersUpdate(users: User[]): void {
    return;
    // const core = this.client.core;
    // if (core === undefined) {
    //   return;
    // }

    // const me = users.find(u => u.id === this.client.user.id);
    // if (me !== undefined) {
    //   this.client.user = me;
    // }

    // const userInfos = users.map(u => {
    //   const connected = core.clients.some(c => c.user.id === u.id);
    //   return CoreSocket.buildUserInfo(u, connected);
    // });
    // this.socket.emit('core:usersInfo', userInfos);
  }

  private buildCoreInfo(): CoreInfo {
    return {
      clientId: this.client.id,
      clients: this.core.clients.map(client => ({
        clientId: client.id,
        userId: client.user.id
      })),
      users: this.core.clients.map(client => CoreSocket.buildUserInfo(client.user)),
      games: this.core.games.map(game => CoreSocket.buildGameInfo(game))
    };
  }

  private getCoreInfo(data: void, response: Response<CoreInfo>): void {
    response('ok', this.buildCoreInfo());
  }

  private createGame(params: { deck: string[], gameSettings: GameSettings, clientId?: number, artworks?: { code: string; artworkId?: number }[], deckId?: number, opponentUsername?: string },
    response: Response<GameState>): void {
    // Validate that only admins can enable sandbox mode
    if (params.gameSettings.sandboxMode && this.client.user.roleId !== 4) {
      response('error', ApiErrorEnum.ACTION_INVALID);
      return;
    }

    let invited = this.core.clients.find(c => c.id === params.clientId);

    // If opponentUsername is provided and no clientId, look up the bot by username
    if (!invited && params.opponentUsername) {
      const botManager = this.core.getBotManager();
      try {
        invited = botManager.getBot(params.opponentUsername);
      } catch (error) {
        response('error', ApiErrorEnum.ACTION_INVALID);
        return;
      }
    }

    // Check if the invited client is a bot with format restrictions
    if (invited && this.isBotClient(invited)) {
      const botClient = invited as BotClient;
      if (!botClient.isFormatAllowed(params.gameSettings.format)) {
        response('error', ApiErrorEnum.INVALID_FORMAT);
        return;
      }
      // Set the player's deck as the bot's pending deck so it can respond to the invite
      botClient.setPendingDeck(params.deck);
    }

    const game = this.core.createGame(this.client, params.deck, params.gameSettings, invited, params.deckId);
    response('ok', CoreSocket.buildGameState(game));
  }

  private createGameFromState(
    params: { stateData: string, gameSettings?: GameSettings, opponentUsername?: string, winConditions?: State['winConditions'] },
    response: Response<GameState>
  ): void {
    try {
      // Decode the base64 state data
      const base64 = new Base64();
      let serializedState = base64.decode(params.stateData);

      // Preprocess card names with normalization and card replacements
      try {
        const parsed = JSON.parse(serializedState);
        if (parsed[1] && Array.isArray(parsed[1].cardNames)) {
          parsed[1].cardNames = parsed[1].cardNames.map((name: string) => {
            name = name.replace('é', 'e');
            const normalizedName = StateSerializer.normalizeCardName(name);
            if (!normalizedName) {
              console.warn('[sandbox] normalizeCardName returned empty for:', name);
            }
            return normalizedName || name;
          });
          serializedState = JSON.stringify(parsed);
        } else {
          console.warn('[sandbox] No cardNames found in parsed state. Keys:', parsed[1] ? Object.keys(parsed[1]) : 'parsed[1] is falsy');
        }
      } catch (parseError: any) {
        console.error('[sandbox] Error preprocessing card names:', parseError);
      }

      const serializer = new StateSerializer();
      const state = serializer.deserialize(serializedState);

      if (!state || !state.players || state.players.length === 0) {
        response('error', ApiErrorEnum.ACTION_INVALID);
        return;
      }

      // Look up the opponent bot if username is provided
      let opponentClient: Client | undefined;
      if (params.opponentUsername) {
        const botManager = this.core.getBotManager();
        try {
          opponentClient = botManager.getBot(params.opponentUsername);
        } catch (error) {
          console.error('Bot not found:', params.opponentUsername);
          // Continue without opponent - game will work but opponent won't respond
        }
      }

      // Create game settings with sandbox mode enabled
      const gameSettings = params.gameSettings || new GameSettings();
      gameSettings.sandboxMode = true;

      // Apply win conditions to state if provided
      if (params.winConditions) {
        state.winConditions = params.winConditions;
      }

      // Create the game from the state with the opponent client
      const game = this.core.createGameFromState(this.client, state, gameSettings, opponentClient);
      response('ok', CoreSocket.buildGameState(game));
    } catch (error: any) {
      console.error('[sandbox] Error creating game from state:', error?.message || error, 'Params:', params.stateData?.slice(0, 100));
      response('error', ApiErrorEnum.ACTION_INVALID);
    }
  }

  // private normalizeCardNamesInSerializedState(serializedState: string): string {
  //   const parsed = JSON.parse(serializedState);
  //   const cardNames: string[] = parsed[1]?.cardNames;

  //   if (Array.isArray(cardNames)) {
  //     parsed[1].cardNames = cardNames.map(name => StateSerializer.normalizeCardName(name));
  //   }

  //   return JSON.stringify(parsed);
  // }

  public static buildUserInfo(user: User, connected: boolean = true): UserInfo {
    return {
      connected,
      userId: user.id,
      name: user.name,
      email: user.email,
      registered: user.registered,
      lastSeen: user.lastSeen,
      ranking: user.ranking,
      rank: user.getRank(),
      lastRankingChange: user.lastRankingChange,
      avatarFile: user.avatarFile,
      roleId: user.roleId
    };
  }

  private static buildGameInfo(game: Game): GameInfo {
    const state = game.state;
    const players: PlayerInfo[] = state.players.map(player => ({
      clientId: player.id,
      name: player.name,
      prizes: player.prizes.reduce((sum, cardList) => sum + cardList.cards.length, 0),
      deck: player.deck.cards.length
    }));
    return {
      gameId: game.id,
      phase: state.phase,
      turn: state.turn,
      activePlayer: state.activePlayer,
      players: players
    };
  }

  public static buildGameState(game: Game): GameState {
    const serializer = new StateSerializer();
    const serializedState = serializer.serialize(game.state);
    const stateObj = JSON.parse(serializedState);
    const finalSerializedState = JSON.stringify(stateObj);
    const base64 = new Base64();
    const stateData = base64.encode(finalSerializedState);
    return {
      gameId: game.id,
      stateData,
      clientIds: game.clients.map(client => client.id),
      recordingEnabled: game.gameSettings.recordingEnabled,
      timeLimit: game.gameSettings.timeLimit,
      playerStats: game.playerStats,
      format: game.format
    };
  }

  public dispose(): void {
    this.socket.removeListener('core:getInfo');
    this.socket.removeListener('core:createGame');
    this.socket.removeListener('core:createGameFromState');
  }

  private isBotClient(client: Client): boolean {
    // Check if the client has bot-specific methods
    return 'isFormatAllowed' in client && 'getAllowedFormats' in client;
  }

}