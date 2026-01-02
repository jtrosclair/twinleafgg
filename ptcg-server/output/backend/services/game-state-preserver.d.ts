import { DisconnectedSession } from '../../storage/model/disconnected-session';
import { State } from '../../game/store/state/state';
export interface PreservedGameState {
    gameId: number;
    userId: number;
    state: State;
    preservedAt: number;
    lastActivity: number;
}
export interface GameStatePreserverConfig {
    preservationTimeoutMs: number;
    maxPreservedSessionsPerUser: number;
    maxSerializedStateSize: number;
    compressionEnabled: boolean;
}
export declare class GameStatePreserver {
    private config;
    private stateSerializer;
    constructor(config: GameStatePreserverConfig);
    /**
     * Preserve game state for a disconnected player
     */
    preserveGameState(gameId: number, userId: number, state: State): Promise<void>;
    /**
     * Retrieve preserved game state
     */
    getPreservedState(gameId: number, userId: number): Promise<PreservedGameState | null>;
    /**
     * Remove preserved state (on successful reconnection or expiry)
     */
    removePreservedState(gameId: number, userId: number): Promise<void>;
    /**
     * Check if game state is preserved for user
     */
    hasPreservedState(gameId: number, userId: number): Promise<boolean>;
    /**
     * Clean up expired sessions
     */
    cleanupExpiredSessions(): Promise<number>;
    /**
     * Get all preserved sessions for a user
     */
    getPreservedSessionsForUser(userId: number): Promise<DisconnectedSession[]>;
    /**
     * Serialize game state with error handling
     */
    private serializeState;
    /**
     * Serialize game state with size validation and optional compression
     */
    private serializeStateWithValidation;
    /**
     * Compress serialized state using gzip
     */
    private compressState;
    /**
     * Decompress serialized state
     */
    private decompressState;
    /**
     * Deserialize game state with error handling
     */
    private deserializeState;
    /**
     * Deserialize game state with compression support
     */
    private deserializeStateWithCompression;
    /**
     * Check if a serialized state is compressed
     */
    private isCompressedState;
    /**
     * Enforce session limits per user
     */
    private enforceSessionLimits;
    /**
     * Get player index for a user in the game state
     */
    private getPlayerIndex;
    /**
     * Update configuration at runtime
     */
    updateConfig(newConfig: Partial<GameStatePreserverConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): GameStatePreserverConfig;
}
