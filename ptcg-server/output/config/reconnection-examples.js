"use strict";
/**
 * Reconnection Configuration Examples
 *
 * This file provides example configurations for different deployment scenarios.
 * These examples demonstrate how to configure the reconnection system for
 * optimal performance in various environments.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectionConfigFactory = exports.tournamentConfig = exports.unreliableNetworkConfig = exports.resourceConstrainedConfig = exports.highLoadConfig = exports.productionConfig = exports.developmentConfig = void 0;
const reconnection_config_validator_1 = require("../backend/services/reconnection-config-validator");
const reconnection_config_manager_1 = require("../backend/services/reconnection-config-manager");
/**
 * Development Environment Configuration
 *
 * Optimized for development with fast feedback and debugging capabilities.
 * Features shorter timeouts and more frequent checks for rapid iteration.
 */
exports.developmentConfig = {
    preservationTimeoutMs: 2 * 60 * 1000,
    maxAutoReconnectAttempts: 2,
    reconnectIntervals: [2000, 5000],
    healthCheckIntervalMs: 15 * 1000,
    cleanupIntervalMs: 30 * 1000,
    maxPreservedSessionsPerUser: 1 // Single session for simplicity
};
/**
 * Production Environment Configuration (Standard)
 *
 * Balanced configuration suitable for most production environments.
 * Provides good user experience while maintaining reasonable resource usage.
 */
exports.productionConfig = {
    preservationTimeoutMs: 5 * 60 * 1000,
    maxAutoReconnectAttempts: 3,
    reconnectIntervals: [5000, 10000, 15000],
    healthCheckIntervalMs: 30 * 1000,
    cleanupIntervalMs: 60 * 1000,
    maxPreservedSessionsPerUser: 1 // Single session per user
};
/**
 * High-Load Environment Configuration
 *
 * Optimized for environments with high concurrent user counts.
 * Reduces resource usage at the cost of some user experience features.
 */
exports.highLoadConfig = {
    preservationTimeoutMs: 3 * 60 * 1000,
    maxAutoReconnectAttempts: 2,
    reconnectIntervals: [10000, 20000],
    healthCheckIntervalMs: 60 * 1000,
    cleanupIntervalMs: 2 * 60 * 1000,
    maxPreservedSessionsPerUser: 1 // Single session to minimize memory
};
/**
 * Resource-Constrained Environment Configuration
 *
 * Optimized for environments with limited memory and CPU resources.
 * Minimizes resource usage while maintaining basic reconnection functionality.
 */
exports.resourceConstrainedConfig = {
    preservationTimeoutMs: 2 * 60 * 1000,
    maxAutoReconnectAttempts: 1,
    reconnectIntervals: [15000],
    healthCheckIntervalMs: 2 * 60 * 1000,
    cleanupIntervalMs: 5 * 60 * 1000,
    maxPreservedSessionsPerUser: 1 // Single session only
};
/**
 * Unreliable Network Environment Configuration
 *
 * Optimized for environments where users frequently experience network issues.
 * Provides extended timeouts and more reconnection attempts.
 */
exports.unreliableNetworkConfig = {
    preservationTimeoutMs: 10 * 60 * 1000,
    maxAutoReconnectAttempts: 5,
    reconnectIntervals: [5000, 10000, 15000, 20000, 30000],
    healthCheckIntervalMs: 20 * 1000,
    cleanupIntervalMs: 60 * 1000,
    maxPreservedSessionsPerUser: 1 // Single session
};
/**
 * Gaming Tournament Configuration
 *
 * Optimized for competitive gaming environments where reconnection
 * reliability is critical and resources are typically abundant.
 */
exports.tournamentConfig = {
    preservationTimeoutMs: 15 * 60 * 1000,
    maxAutoReconnectAttempts: 4,
    reconnectIntervals: [3000, 6000, 12000, 20000],
    healthCheckIntervalMs: 15 * 1000,
    cleanupIntervalMs: 60 * 1000,
    maxPreservedSessionsPerUser: 2 // Allow multiple sessions for flexibility
};
/**
 * Configuration Factory
 *
 * Provides a convenient way to get pre-configured setups for different environments.
 */
class ReconnectionConfigFactory {
    /**
     * Get configuration for a specific environment
     */
    static getConfig(environment) {
        switch (environment) {
            case 'development':
                return Object.assign({}, exports.developmentConfig);
            case 'production':
                return Object.assign({}, exports.productionConfig);
            case 'high-load':
                return Object.assign({}, exports.highLoadConfig);
            case 'resource-constrained':
                return Object.assign({}, exports.resourceConstrainedConfig);
            case 'unreliable-network':
                return Object.assign({}, exports.unreliableNetworkConfig);
            case 'tournament':
                return Object.assign({}, exports.tournamentConfig);
            default:
                return Object.assign({}, exports.productionConfig);
        }
    }
    /**
     * Create a validated configuration manager for an environment
     */
    static createConfigManager(environment) {
        const config = this.getConfig(environment);
        // Validate the configuration before creating the manager
        const validation = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
        if (!validation.isValid) {
            throw new Error(`Invalid configuration for environment '${environment}': ${validation.errors.join(', ')}`);
        }
        if (validation.warnings.length > 0) {
            console.warn(`Configuration warnings for environment '${environment}':`, validation.warnings);
        }
        return new reconnection_config_manager_1.ReconnectionConfigManager(config);
    }
    /**
     * Create a custom configuration with validation
     */
    static createCustomConfig(baseEnvironment, overrides) {
        const baseConfig = this.getConfig(baseEnvironment);
        const customConfig = Object.assign(Object.assign({}, baseConfig), overrides);
        // Validate the custom configuration
        const validation = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(customConfig);
        if (!validation.isValid) {
            throw new Error(`Invalid custom configuration: ${validation.errors.join(', ')}`);
        }
        if (validation.warnings.length > 0) {
            console.warn('Custom configuration warnings:', validation.warnings);
        }
        return customConfig;
    }
    /**
     * Get all available environment configurations
     */
    static getAllConfigs() {
        return {
            development: exports.developmentConfig,
            production: exports.productionConfig,
            'high-load': exports.highLoadConfig,
            'resource-constrained': exports.resourceConstrainedConfig,
            'unreliable-network': exports.unreliableNetworkConfig,
            tournament: exports.tournamentConfig
        };
    }
    /**
     * Compare two configurations and show differences
     */
    static compareConfigs(config1, config2) {
        const differences = {};
        for (const key of Object.keys(config1)) {
            if (JSON.stringify(config1[key]) !== JSON.stringify(config2[key])) {
                differences[key] = {
                    config1: config1[key],
                    config2: config2[key]
                };
            }
        }
        return differences;
    }
}
exports.ReconnectionConfigFactory = ReconnectionConfigFactory;
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
