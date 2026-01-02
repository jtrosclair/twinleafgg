/// <reference types="node" />
import { ReconnectionConfig } from '../interfaces/reconnection.interface';
import { ConfigValidationResult, ConfigValidationOptions } from './reconnection-config-validator';
import { EventEmitter } from 'events';
export interface ResourceMetrics {
    availableMemoryMB: number;
    activeSessions: number;
    cpuUsagePercent: number;
    preservedSessions: number;
    timestamp: number;
}
export interface ConfigUpdateEvent {
    oldConfig: ReconnectionConfig;
    newConfig: ReconnectionConfig;
    timestamp: number;
    source: 'runtime' | 'resource-optimization' | 'manual';
}
export interface ResourcePrioritizationRule {
    condition: (metrics: ResourceMetrics, config: ReconnectionConfig) => boolean;
    adjustment: (config: ReconnectionConfig) => Partial<ReconnectionConfig>;
    description: string;
    priority: number;
}
export declare class ReconnectionConfigManager extends EventEmitter {
    private currentConfig;
    private originalConfig;
    private resourceMetrics;
    private prioritizationRules;
    private metricsUpdateInterval;
    private lastResourceOptimization;
    private readonly RESOURCE_OPTIMIZATION_COOLDOWN;
    constructor(initialConfig: ReconnectionConfig);
    /**
     * Get the current configuration
     */
    getCurrentConfig(): ReconnectionConfig;
    /**
     * Update configuration at runtime
     */
    updateConfig(partialConfig: Partial<ReconnectionConfig>, options?: ConfigValidationOptions): ConfigValidationResult;
    /**
     * Reset configuration to original values
     */
    resetToOriginal(): void;
    /**
     * Update resource metrics for prioritization decisions
     */
    updateResourceMetrics(metrics: Partial<ResourceMetrics>): void;
    /**
     * Add a custom prioritization rule
     */
    addPrioritizationRule(rule: ResourcePrioritizationRule): void;
    /**
     * Remove a prioritization rule by description
     */
    removePrioritizationRule(description: string): boolean;
    /**
     * Get current resource metrics
     */
    getResourceMetrics(): ResourceMetrics | null;
    /**
     * Manually trigger resource optimization
     */
    optimizeForResources(): ConfigValidationResult | null;
    /**
     * Dispose of the config manager
     */
    dispose(): void;
    private setupDefaultPrioritizationRules;
    private startResourceMonitoring;
    private checkResourceOptimization;
    private applyResourceOptimization;
    private getConfigDifferences;
}
