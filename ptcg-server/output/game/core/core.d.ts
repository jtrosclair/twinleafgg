import { Client } from '../client/client.interface';
import { Game } from './game';
import { GameSettings } from './game-settings';
import { Messager } from './messager';
import { State } from '../store/state/state';
import { BotManager } from '../bots/bot-manager';
import { ReconnectionManager } from '../../backend/services/reconnection-manager';
import { ReconnectionConfig } from '../../backend/interfaces/reconnection.interface';
export declare class Core {
    clients: Client[];
    games: Game[];
    messager: Messager;
    private botManager;
    private reconnectionManager;
    constructor(reconnectionConfig?: ReconnectionConfig);
    getBotManager(): BotManager;
    getReconnectionManager(): ReconnectionManager;
    connect(client: Client): Promise<Client>;
    disconnect(client: Client, reason?: string): Promise<void>;
    createGame(client: Client, deck: string[], gameSettings?: GameSettings, invited?: Client, deckId1?: number, deckId2?: number): Game;
    createGameWithDecks(client: Client, deck: string[], gameSettings: GameSettings, client2: Client, deck2: string[], artworksMap1?: {
        [code: string]: {
            imageUrl: string;
            holoType?: string;
        };
    }, artworksMap2?: {
        [code: string]: {
            imageUrl: string;
            holoType?: string;
        };
    }, deckId1?: number, deckId2?: number): Game;
    joinGame(client: Client, game: Game): void;
    deleteGame(game: Game): void;
    leaveGame(client: Client, game: Game): void;
    emit(fn: (client: Client) => void): void;
    /**
     * Emit an event to all clients in a specific game using Socket.IO rooms
     */
    emitToGame(gameId: number, event: string, data: any): void;
    /**
     * Broadcast user updates to all connected clients
     */
    private broadcastUserUpdates;
    private startRankingDecrease;
    private inactiveGameCleanupInterval;
    private startInactiveGameCleanup;
    /**
     * Dispose of the Core and cleanup resources
     */
    dispose(): void;
    private isBotClient;
    /**
     * Creates a game initialized with a specific state.
     * Used for sandbox/viewer mode where a game state is loaded from base64.
     * The client will be assigned as the active player.
     */
    createGameFromState(client: Client, state: State, gameSettings?: GameSettings, opponentClient?: Client): Game;
}
