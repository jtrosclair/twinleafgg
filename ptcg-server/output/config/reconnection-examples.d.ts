/**
 * Reconnection Configuration Examples
 *
 * This file provides example configurations for different deployment scenarios.
 * These examples demonstrate how to configure the reconnection system for
 * optimal performance in various environments.
 */
import { ReconnectionConfig } from '../backend/interfaces/reconnection.interface';
import { ReconnectionConfigManager } from '../backend/services/reconnection-config-manager';
/**
 * Development Environment Configuration
 *
 * Optimized for development with fast feedback and debugging capabilities.
 * Features shorter timeouts and more frequent checks for rapid iteration.
 */
export declare const developmentConfig: ReconnectionConfig;
/**
 * Production Environment Configuration (Standard)
 *
 * Balanced configuration suitable for most production environments.
 * Provides good user experience while maintaining reasonable resource usage.
 */
export declare const productionConfig: ReconnectionConfig;
/**
 * High-Load Environment Configuration
 *
 * Optimized for environments with high concurrent user counts.
 * Reduces resource usage at the cost of some user experience features.
 */
export declare const highLoadConfig: ReconnectionConfig;
/**
 * Resource-Constrained Environment Configuration
 *
 * Optimized for environments with limited memory and CPU resources.
 * Minimizes resource usage while maintaining basic reconnection functionality.
 */
export declare const resourceConstrainedConfig: ReconnectionConfig;
/**
 * Unreliable Network Environment Configuration
 *
 * Optimized for environments where users frequently experience network issues.
 * Provides extended timeouts and more reconnection attempts.
 */
export declare const unreliableNetworkConfig: ReconnectionConfig;
/**
 * Gaming Tournament Configuration
 *
 * Optimized for competitive gaming environments where reconnection
 * reliability is critical and resources are typically abundant.
 */
export declare const tournamentConfig: ReconnectionConfig;
/**
 * Configuration Factory
 *
 * Provides a convenient way to get pre-configured setups for different environments.
 */
export declare class ReconnectionConfigFactory {
    /**
     * Get configuration for a specific environment
     */
    static getConfig(environment: 'development' | 'production' | 'high-load' | 'resource-constrained' | 'unreliable-network' | 'tournament'): ReconnectionConfig;
    /**
     * Create a validated configuration manager for an environment
     */
    static createConfigManager(environment: 'development' | 'production' | 'high-load' | 'resource-constrained' | 'unreliable-network' | 'tournament'): ReconnectionConfigManager;
    /**
     * Create a custom configuration with validation
     */
    static createCustomConfig(baseEnvironment: 'development' | 'production' | 'high-load' | 'resource-constrained' | 'unreliable-network' | 'tournament', overrides: Partial<ReconnectionConfig>): ReconnectionConfig;
    /**
     * Get all available environment configurations
     */
    static getAllConfigs(): Record<string, ReconnectionConfig>;
    /**
     * Compare two configurations and show differences
     */
    static compareConfigs(config1: ReconnectionConfig, config2: ReconnectionConfig): Record<string, {
        config1: any;
        config2: any;
    }>;
}
/**
 * Example Usage:
 *
 * // Get a pre-configured setup
 * const configManager = ReconnectionConfigFactory.createConfigManager('production');
 *
 * // Create a custom configuration
 * const customConfig = ReconnectionConfigFactory.createCustomConfig('production', {
 *   preservationTimeoutMs: 8 * 60 * 1000,  // 8 minutes instead of 5
 *   maxAutoReconnectAttempts: 4             // 4 attempts instead of 3
 * });
 *
 * // Runtime configuration updates
 * configManager.updateConfig({
 *   preservationTimeoutMs: 10 * 60 * 1000  // Increase to 10 minutes
 * });
 *
 * // Resource-based optimization
 * configManager.updateResourceMetrics({
 *   availableMemoryMB: 1024,
 *   activeSessions: 500,
 *   cpuUsagePercent: 75,
 *   preservedSessions: 50
 * });
 *
 * // Listen for configuration changes
 * configManager.on('configUpdated', (event) => {
 *   console.log(`Configuration updated: ${event.source}`);
 *   console.log('New config:', event.newConfig);
 * });
 */ 
