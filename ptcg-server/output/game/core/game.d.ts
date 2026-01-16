import { Action } from '../store/actions/action';
import { Client } from '../client/client.interface';
import { Core } from './core';
import { GameSettings } from './game-settings';
import { PlayerStats } from './player-stats';
import { State } from '../store/state/state';
import { Store } from '../store/store';
import { StoreHandler } from '../store/store-handler';
import { Format } from '../store/card/card-types';
export interface DisconnectedPlayer {
    clientId: number;
    userId: number;
    disconnectedAt: number;
    wasActivePlayer: boolean;
    timeLeftWhenDisconnected: number;
}
export declare class Game implements StoreHandler {
    private core;
    gameSettings: GameSettings;
    private readonly maxInvalidMoves;
    id: number;
    clients: Client[];
    playerStats: PlayerStats[];
    private arbiter;
    private store;
    private matchRecorder;
    private timeoutRef;
    private lastActivity;
    format: Format;
    private periodicSyncRef;
    private stateHistory;
    private turnStartHistoryIndex;
    private disconnectedPlayers;
    private disconnectionTimeouts;
    private isPaused;
    private pausedAt;
    constructor(core: Core, id: number, gameSettings: GameSettings);
    get state(): State;
    getStore(): Store;
    updateLastActivity(): void;
    getLastActivity(): number;
    isInactive(timeoutMs?: number): boolean;
    cleanup(): void;
    setBonusHps(state: State): void;
    onStateChange(state: State): void;
    private handleArbiterPrompts;
    dispatch(client: Client, action: Action): State;
    private isStartOfTurnAction;
    handleClientLeave(client: Client): void;
    /**
     * Handle player disconnection - preserve state and notify other players
     */
    handlePlayerDisconnection(client: Client): void;
    /**
     * Handle player reconnection - restore state and resume game
     */
    handlePlayerReconnection(client: Client): boolean;
    /**
     * Synchronize reconnected player with current game state
     */
    private synchronizeReconnectedPlayer;
    /**
     * Pause the game due to player disconnection
     */
    private pauseGame;
    /**
     * Resume the game after player reconnection
     */
    private resumeGame;
    /**
     * Notify other players of a disconnection
     */
    private notifyPlayersOfDisconnection;
    /**
     * Notify other players of a reconnection
     */
    private notifyPlayersOfReconnection;
    /**
     * Check if a player is currently disconnected
     */
    isPlayerDisconnected(clientId: number): boolean;
    /**
     * Get disconnected player info by clientId
     */
    getDisconnectedPlayerInfo(clientId: number): DisconnectedPlayer | undefined;
    /**
     * Get disconnected player info by userId (for reconnection)
     */
    getDisconnectedPlayerByUserId(userId: number): DisconnectedPlayer | undefined;
    /**
     * Get all disconnected players
     */
    getDisconnectedPlayers(): DisconnectedPlayer[];
    /**
     * Check if game is paused due to disconnections
     */
    isPausedForDisconnection(): boolean;
    /**
     * Force abort game for players who exceed reconnection timeout
     */
    handleReconnectionTimeout(clientId: number): void;
    /**
     * Clear all disconnection timeouts
     */
    private clearAllDisconnectionTimeouts;
    /**
     * Get connection status for all players in the game
     */
    getConnectionStatuses(): Array<{
        playerId: number;
        playerName: string;
        isConnected: boolean;
        disconnectedAt?: number;
    }>;
    /**
     * Notify players about connection status updates
     */
    notifyConnectionStatusUpdate(): void;
    /**
     * Notify players about reconnection timeout
     */
    private notifyPlayersOfReconnectionTimeout;
    /**
     * Send timeout warning to disconnected player (if they reconnect)
     */
    sendTimeoutWarning(clientId: number, timeRemaining: number): void;
    private updateInvalidMoves;
    private updateIsTimeRunning;
    private startTimer;
    private stopTimer;
    private startPeriodicSync;
    private stopPeriodicSync;
    canUndo(clientId?: number): boolean;
    undo(clientId?: number): boolean;
}
