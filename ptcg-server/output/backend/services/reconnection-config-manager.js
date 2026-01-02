"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectionConfigManager = void 0;
const reconnection_config_validator_1 = require("./reconnection-config-validator");
const logger_1 = require("../../utils/logger");
const events_1 = require("events");
class ReconnectionConfigManager extends events_1.EventEmitter {
    constructor(initialConfig) {
        super();
        this.resourceMetrics = null;
        this.prioritizationRules = [];
        this.metricsUpdateInterval = null;
        this.lastResourceOptimization = 0;
        this.RESOURCE_OPTIMIZATION_COOLDOWN = 30 * 1000; // 30 seconds
        // Validate initial configuration
        const validation = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(initialConfig);
        if (!validation.isValid) {
            throw new Error(`Invalid initial configuration: ${validation.errors.join(', ')}`);
        }
        this.currentConfig = Object.assign({}, initialConfig);
        this.originalConfig = Object.assign({}, initialConfig);
        this.setupDefaultPrioritizationRules();
        this.startResourceMonitoring();
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            message: 'ReconnectionConfigManager initialized',
            data: { config: this.currentConfig }
        });
    }
    /**
     * Get the current configuration
     */
    getCurrentConfig() {
        return Object.assign({}, this.currentConfig);
    }
    /**
     * Update configuration at runtime
     */
    updateConfig(partialConfig, options = {}) {
        const oldConfig = Object.assign({}, this.currentConfig);
        const { config: newConfig, validation } = reconnection_config_validator_1.ReconnectionConfigValidator.mergeAndValidateConfig(Object.assign(Object.assign({}, this.currentConfig), partialConfig), options);
        if (!validation.isValid) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                message: 'Configuration update failed validation',
                data: {
                    errors: validation.errors,
                    warnings: validation.warnings,
                    attemptedConfig: partialConfig
                }
            });
            return validation;
        }
        // Apply the new configuration
        this.currentConfig = newConfig;
        // Emit configuration change event
        const updateEvent = {
            oldConfig,
            newConfig,
            timestamp: Date.now(),
            source: 'runtime'
        };
        this.emit('configUpdated', updateEvent);
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            message: 'Configuration updated successfully',
            data: {
                changes: this.getConfigDifferences(oldConfig, newConfig),
                warnings: validation.warnings
            }
        });
        return validation;
    }
    /**
     * Reset configuration to original values
     */
    resetToOriginal() {
        const oldConfig = Object.assign({}, this.currentConfig);
        this.currentConfig = Object.assign({}, this.originalConfig);
        const updateEvent = {
            oldConfig,
            newConfig: this.currentConfig,
            timestamp: Date.now(),
            source: 'manual'
        };
        this.emit('configUpdated', updateEvent);
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            message: 'Configuration reset to original values',
            data: { config: this.currentConfig }
        });
    }
    /**
     * Update resource metrics for prioritization decisions
     */
    updateResourceMetrics(metrics) {
        this.resourceMetrics = Object.assign(Object.assign(Object.assign({}, this.resourceMetrics), metrics), { timestamp: Date.now() });
        // Check if resource-based optimization is needed
        this.checkResourceOptimization();
    }
    /**
     * Add a custom prioritization rule
     */
    addPrioritizationRule(rule) {
        this.prioritizationRules.push(rule);
        this.prioritizationRules.sort((a, b) => b.priority - a.priority);
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            message: 'Added prioritization rule',
            data: { description: rule.description, priority: rule.priority }
        });
    }
    /**
     * Remove a prioritization rule by description
     */
    removePrioritizationRule(description) {
        const initialLength = this.prioritizationRules.length;
        this.prioritizationRules = this.prioritizationRules.filter(rule => rule.description !== description);
        const removed = this.prioritizationRules.length < initialLength;
        if (removed) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                message: 'Removed prioritization rule',
                data: { description }
            });
        }
        return removed;
    }
    /**
     * Get current resource metrics
     */
    getResourceMetrics() {
        return this.resourceMetrics ? Object.assign({}, this.resourceMetrics) : null;
    }
    /**
     * Manually trigger resource optimization
     */
    optimizeForResources() {
        if (!this.resourceMetrics) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.WARN,
                message: 'Cannot optimize for resources: no metrics available'
            });
            return null;
        }
        return this.applyResourceOptimization(this.resourceMetrics);
    }
    /**
     * Dispose of the config manager
     */
    dispose() {
        if (this.metricsUpdateInterval) {
            clearInterval(this.metricsUpdateInterval);
            this.metricsUpdateInterval = null;
        }
        this.removeAllListeners();
    }
    setupDefaultPrioritizationRules() {
        // High memory usage rule
        this.addPrioritizationRule({
            condition: (metrics, config) => {
                const estimatedMemoryUsage = metrics.preservedSessions * 1; // 1MB per session estimate
                return estimatedMemoryUsage > metrics.availableMemoryMB * 0.7;
            },
            adjustment: (config) => ({
                preservationTimeoutMs: Math.max(config.preservationTimeoutMs * 0.7, 2 * 60 * 1000),
                maxPreservedSessionsPerUser: Math.max(config.maxPreservedSessionsPerUser - 1, 1)
            }),
            description: 'High memory usage optimization',
            priority: 100
        });
        // High CPU usage rule
        this.addPrioritizationRule({
            condition: (metrics, config) => metrics.cpuUsagePercent > 85,
            adjustment: (config) => ({
                healthCheckIntervalMs: Math.min(config.healthCheckIntervalMs * 1.5, 2 * 60 * 1000),
                cleanupIntervalMs: Math.min(config.cleanupIntervalMs * 1.3, 5 * 60 * 1000),
                maxAutoReconnectAttempts: Math.max(config.maxAutoReconnectAttempts - 1, 1)
            }),
            description: 'High CPU usage optimization',
            priority: 90
        });
        // High session count rule
        this.addPrioritizationRule({
            condition: (metrics, config) => metrics.activeSessions > 1000,
            adjustment: (config) => ({
                healthCheckIntervalMs: Math.min(config.healthCheckIntervalMs * 1.2, 90 * 1000),
                maxAutoReconnectAttempts: Math.max(config.maxAutoReconnectAttempts - 1, 2)
            }),
            description: 'High session count optimization',
            priority: 80
        });
        // Critical resource shortage rule
        this.addPrioritizationRule({
            condition: (metrics, config) => {
                const memoryUsagePercent = (metrics.preservedSessions * 1) / metrics.availableMemoryMB * 100;
                return memoryUsagePercent > 90 || metrics.cpuUsagePercent > 95;
            },
            adjustment: (config) => ({
                preservationTimeoutMs: Math.max(config.preservationTimeoutMs * 0.5, 60 * 1000),
                maxAutoReconnectAttempts: 1,
                maxPreservedSessionsPerUser: 1,
                healthCheckIntervalMs: Math.min(config.healthCheckIntervalMs * 2, 3 * 60 * 1000) // Double, max 3 minutes
            }),
            description: 'Critical resource shortage emergency optimization',
            priority: 200
        });
    }
    startResourceMonitoring() {
        // Start periodic resource optimization checks
        this.metricsUpdateInterval = setInterval(() => {
            if (this.resourceMetrics) {
                this.checkResourceOptimization();
            }
        }, 30 * 1000); // Check every 30 seconds
    }
    checkResourceOptimization() {
        if (!this.resourceMetrics)
            return;
        const now = Date.now();
        if (now - this.lastResourceOptimization < this.RESOURCE_OPTIMIZATION_COOLDOWN) {
            return; // Too soon since last optimization
        }
        // Check if any prioritization rules apply
        const applicableRules = this.prioritizationRules.filter(rule => rule.condition(this.resourceMetrics, this.currentConfig));
        if (applicableRules.length > 0) {
            this.applyResourceOptimization(this.resourceMetrics);
        }
    }
    applyResourceOptimization(metrics) {
        const oldConfig = Object.assign({}, this.currentConfig);
        let adjustments = {};
        // Apply all applicable rules in priority order
        const applicableRules = this.prioritizationRules.filter(rule => rule.condition(metrics, this.currentConfig));
        for (const rule of applicableRules) {
            const ruleAdjustments = rule.adjustment(this.currentConfig);
            adjustments = Object.assign(Object.assign({}, adjustments), ruleAdjustments);
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                message: 'Applying resource optimization rule',
                data: {
                    rule: rule.description,
                    adjustments: ruleAdjustments,
                    metrics
                }
            });
        }
        if (Object.keys(adjustments).length === 0) {
            return { isValid: true, errors: [], warnings: [] };
        }
        // Validate and apply the optimized configuration
        const { config: optimizedConfig, validation } = reconnection_config_validator_1.ReconnectionConfigValidator.mergeAndValidateConfig(Object.assign(Object.assign({}, this.currentConfig), adjustments));
        if (validation.isValid) {
            this.currentConfig = optimizedConfig;
            this.lastResourceOptimization = Date.now();
            const updateEvent = {
                oldConfig,
                newConfig: optimizedConfig,
                timestamp: Date.now(),
                source: 'resource-optimization'
            };
            this.emit('configUpdated', updateEvent);
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                message: 'Resource-based configuration optimization applied',
                data: {
                    appliedRules: applicableRules.map(r => r.description),
                    changes: this.getConfigDifferences(oldConfig, optimizedConfig),
                    metrics
                }
            });
        }
        else {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                message: 'Resource optimization failed validation',
                data: {
                    errors: validation.errors,
                    warnings: validation.warnings,
                    attemptedAdjustments: adjustments
                }
            });
        }
        return validation;
    }
    getConfigDifferences(oldConfig, newConfig) {
        const differences = {};
        for (const key of Object.keys(newConfig)) {
            if (JSON.stringify(oldConfig[key]) !== JSON.stringify(newConfig[key])) {
                differences[key] = {
                    old: oldConfig[key],
                    new: newConfig[key]
                };
            }
        }
        return differences;
    }
}
exports.ReconnectionConfigManager = ReconnectionConfigManager;
