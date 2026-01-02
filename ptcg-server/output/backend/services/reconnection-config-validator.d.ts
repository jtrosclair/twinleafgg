import { ReconnectionConfig } from '../interfaces/reconnection.interface';
export interface ConfigValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
export interface ConfigValidationOptions {
    strict?: boolean;
    allowPartialConfig?: boolean;
}
export declare class ReconnectionConfigValidator {
    private static readonly MIN_PRESERVATION_TIMEOUT;
    private static readonly MAX_PRESERVATION_TIMEOUT;
    private static readonly MIN_RECONNECT_ATTEMPTS;
    private static readonly MAX_RECONNECT_ATTEMPTS;
    private static readonly MIN_INTERVAL;
    private static readonly MAX_INTERVAL;
    private static readonly MIN_HEALTH_CHECK_INTERVAL;
    private static readonly MAX_HEALTH_CHECK_INTERVAL;
    private static readonly MIN_CLEANUP_INTERVAL;
    private static readonly MAX_CLEANUP_INTERVAL;
    private static readonly MIN_MAX_SESSIONS;
    private static readonly MAX_MAX_SESSIONS;
    /**
     * Validates a complete reconnection configuration
     */
    static validateConfig(config: Partial<ReconnectionConfig>, options?: ConfigValidationOptions): ConfigValidationResult;
    /**
     * Creates a default configuration with all required fields
     */
    static getDefaultConfig(): ReconnectionConfig;
    /**
     * Merges partial configuration with defaults and validates the result
     */
    static mergeAndValidateConfig(partialConfig: Partial<ReconnectionConfig>, options?: ConfigValidationOptions): {
        config: ReconnectionConfig;
        validation: ConfigValidationResult;
    };
    /**
     * Validates configuration for resource constraints
     */
    static validateResourceConstraints(config: ReconnectionConfig, resourceMetrics: {
        availableMemoryMB: number;
        activeSessions: number;
        cpuUsagePercent: number;
    }): ConfigValidationResult;
}
