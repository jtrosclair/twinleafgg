"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reconnection_config_validator_1 = require("./reconnection-config-validator");
describe('ReconnectionConfigValidator', () => {
    let validConfig;
    beforeEach(() => {
        validConfig = {
            preservationTimeoutMs: 5 * 60 * 1000,
            maxAutoReconnectAttempts: 3,
            reconnectIntervals: [5000, 10000, 15000],
            healthCheckIntervalMs: 30 * 1000,
            cleanupIntervalMs: 60 * 1000,
            maxPreservedSessionsPerUser: 1
        };
    });
    describe('validateConfig', () => {
        it('should validate a correct configuration', () => {
            const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(validConfig);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.warnings).toEqual([]);
        });
        it('should require all fields when allowPartialConfig is false', () => {
            const partialConfig = {
                preservationTimeoutMs: 5 * 60 * 1000
            };
            const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(partialConfig, {
                allowPartialConfig: false
            });
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing required field: maxAutoReconnectAttempts');
            expect(result.errors).toContain('Missing required field: reconnectIntervals');
            expect(result.errors).toContain('Missing required field: healthCheckIntervalMs');
            expect(result.errors).toContain('Missing required field: cleanupIntervalMs');
            expect(result.errors).toContain('Missing required field: maxPreservedSessionsPerUser');
        });
        it('should allow partial config when allowPartialConfig is true', () => {
            const partialConfig = {
                preservationTimeoutMs: 5 * 60 * 1000
            };
            const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(partialConfig, {
                allowPartialConfig: true
            });
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });
        describe('preservationTimeoutMs validation', () => {
            it('should reject negative values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { preservationTimeoutMs: -1000 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('preservationTimeoutMs must be a non-negative integer');
            });
            it('should reject non-integer values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { preservationTimeoutMs: 5000.5 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('preservationTimeoutMs must be a non-negative integer');
            });
            it('should reject values below minimum', () => {
                const config = Object.assign(Object.assign({}, validConfig), { preservationTimeoutMs: 15000 }); // 15 seconds, below 30s minimum
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('preservationTimeoutMs must be at least 30000ms (30s)');
            });
            it('should warn about very high values in non-strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { preservationTimeoutMs: 35 * 60 * 1000 }); // 35 minutes
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: false });
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('preservationTimeoutMs of 2100000ms (35m) is very high and may consume excessive resources');
            });
            it('should reject very high values in strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { preservationTimeoutMs: 35 * 60 * 1000 }); // 35 minutes
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: true });
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('preservationTimeoutMs must not exceed 1800000ms (30m)');
            });
        });
        describe('maxAutoReconnectAttempts validation', () => {
            it('should reject negative values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxAutoReconnectAttempts: -1 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('maxAutoReconnectAttempts must be a non-negative integer');
            });
            it('should reject non-integer values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxAutoReconnectAttempts: 3.5 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('maxAutoReconnectAttempts must be a non-negative integer');
            });
            it('should reject values below minimum', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxAutoReconnectAttempts: 0 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('maxAutoReconnectAttempts must be at least 1');
            });
            it('should warn about very high values in non-strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxAutoReconnectAttempts: 15 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: false });
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('maxAutoReconnectAttempts of 15 is very high and may cause excessive network traffic');
            });
            it('should reject very high values in strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxAutoReconnectAttempts: 15 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: true });
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('maxAutoReconnectAttempts must not exceed 10');
            });
        });
        describe('reconnectIntervals validation', () => {
            it('should reject non-array values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { reconnectIntervals: 5000 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('reconnectIntervals must be an array');
            });
            it('should reject empty arrays', () => {
                const config = Object.assign(Object.assign({}, validConfig), { reconnectIntervals: [] });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('reconnectIntervals must contain at least one interval');
            });
            it('should reject negative interval values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { reconnectIntervals: [5000, -1000, 15000] });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('reconnectIntervals[1] must be a non-negative integer');
            });
            it('should reject non-integer interval values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { reconnectIntervals: [5000, 10000.5, 15000] });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('reconnectIntervals[1] must be a non-negative integer');
            });
            it('should reject intervals below minimum', () => {
                const config = Object.assign(Object.assign({}, validConfig), { reconnectIntervals: [500, 10000, 15000] }); // 500ms below 1s minimum
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('reconnectIntervals[0] must be at least 1000ms');
            });
            it('should warn about very high intervals in non-strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { reconnectIntervals: [5000, 70000, 15000] }); // 70s above 60s maximum
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: false });
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('reconnectIntervals[1] of 70000ms is very high');
            });
            it('should reject very high intervals in strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { reconnectIntervals: [5000, 70000, 15000] }); // 70s above 60s maximum
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: true });
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('reconnectIntervals[1] must not exceed 60000ms');
            });
            it('should warn about non-increasing intervals', () => {
                const config = Object.assign(Object.assign({}, validConfig), { reconnectIntervals: [10000, 5000, 15000] }); // Decreasing pattern
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('reconnectIntervals should generally increase to implement exponential backoff');
            });
        });
        describe('healthCheckIntervalMs validation', () => {
            it('should reject negative values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { healthCheckIntervalMs: -5000 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('healthCheckIntervalMs must be a non-negative integer');
            });
            it('should reject values below minimum', () => {
                const config = Object.assign(Object.assign({}, validConfig), { healthCheckIntervalMs: 3000 }); // 3s below 5s minimum
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('healthCheckIntervalMs must be at least 5000ms');
            });
            it('should warn about very high values in non-strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { healthCheckIntervalMs: 6 * 60 * 1000 }); // 6 minutes
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: false });
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('healthCheckIntervalMs of 360000ms is very high and may delay disconnection detection');
            });
        });
        describe('cleanupIntervalMs validation', () => {
            it('should reject negative values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { cleanupIntervalMs: -10000 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('cleanupIntervalMs must be a non-negative integer');
            });
            it('should reject values below minimum', () => {
                const config = Object.assign(Object.assign({}, validConfig), { cleanupIntervalMs: 5000 }); // 5s below 10s minimum
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('cleanupIntervalMs must be at least 10000ms');
            });
            it('should warn about very high values in non-strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { cleanupIntervalMs: 15 * 60 * 1000 }); // 15 minutes
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: false });
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('cleanupIntervalMs of 900000ms is very high and may delay cleanup of expired sessions');
            });
        });
        describe('maxPreservedSessionsPerUser validation', () => {
            it('should reject negative values', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxPreservedSessionsPerUser: -1 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('maxPreservedSessionsPerUser must be a non-negative integer');
            });
            it('should reject values below minimum', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxPreservedSessionsPerUser: 0 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('maxPreservedSessionsPerUser must be at least 1');
            });
            it('should warn about very high values in non-strict mode', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxPreservedSessionsPerUser: 10 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config, { strict: false });
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('maxPreservedSessionsPerUser of 10 is very high and may consume excessive memory');
            });
        });
        describe('cross-field validations', () => {
            it('should warn when cleanup interval is too large relative to preservation timeout', () => {
                const config = Object.assign(Object.assign({}, validConfig), { preservationTimeoutMs: 2 * 60 * 1000, cleanupIntervalMs: 2 * 60 * 1000 // 2 minutes (should be much smaller)
                 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('cleanupIntervalMs should be significantly smaller than preservationTimeoutMs for efficient cleanup');
            });
            it('should warn when reconnect intervals array is shorter than max attempts', () => {
                const config = Object.assign(Object.assign({}, validConfig), { maxAutoReconnectAttempts: 5, reconnectIntervals: [5000, 10000] // Only 2 intervals for 5 attempts
                 });
                const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(config);
                expect(result.isValid).toBe(true);
                expect(result.warnings).toContain('reconnectIntervals array should have at least as many entries as maxAutoReconnectAttempts');
            });
        });
    });
    describe('getDefaultConfig', () => {
        it('should return a valid default configuration', () => {
            const defaultConfig = reconnection_config_validator_1.ReconnectionConfigValidator.getDefaultConfig();
            const validation = reconnection_config_validator_1.ReconnectionConfigValidator.validateConfig(defaultConfig);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toEqual([]);
            expect(defaultConfig.preservationTimeoutMs).toBe(5 * 60 * 1000);
            expect(defaultConfig.maxAutoReconnectAttempts).toBe(3);
            expect(defaultConfig.reconnectIntervals).toEqual([5000, 10000, 15000]);
            expect(defaultConfig.healthCheckIntervalMs).toBe(30 * 1000);
            expect(defaultConfig.cleanupIntervalMs).toBe(60 * 1000);
            expect(defaultConfig.maxPreservedSessionsPerUser).toBe(1);
        });
    });
    describe('mergeAndValidateConfig', () => {
        it('should merge partial config with defaults', () => {
            const partialConfig = {
                preservationTimeoutMs: 8 * 60 * 1000,
                maxAutoReconnectAttempts: 5
            };
            const { config, validation } = reconnection_config_validator_1.ReconnectionConfigValidator.mergeAndValidateConfig(partialConfig);
            expect(validation.isValid).toBe(true);
            expect(config.preservationTimeoutMs).toBe(8 * 60 * 1000);
            expect(config.maxAutoReconnectAttempts).toBe(5);
            expect(config.reconnectIntervals).toEqual([5000, 10000, 15000]); // From defaults
            expect(config.healthCheckIntervalMs).toBe(30 * 1000); // From defaults
        });
        it('should validate the merged configuration', () => {
            const partialConfig = {
                preservationTimeoutMs: -1000 // Invalid value
            };
            const { validation } = reconnection_config_validator_1.ReconnectionConfigValidator.mergeAndValidateConfig(partialConfig);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('preservationTimeoutMs must be a non-negative integer');
        });
    });
    describe('validateResourceConstraints', () => {
        it('should validate configuration against resource metrics', () => {
            const config = reconnection_config_validator_1.ReconnectionConfigValidator.getDefaultConfig();
            const resourceMetrics = {
                availableMemoryMB: 2048,
                activeSessions: 100,
                cpuUsagePercent: 50
            };
            const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateResourceConstraints(config, resourceMetrics);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });
        it('should warn about high memory usage', () => {
            const config = Object.assign(Object.assign({}, validConfig), { maxPreservedSessionsPerUser: 3 });
            const resourceMetrics = {
                availableMemoryMB: 100,
                activeSessions: 200,
                cpuUsagePercent: 50
            };
            const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateResourceConstraints(config, resourceMetrics);
            expect(result.isValid).toBe(true);
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings.some(w => w.includes('memory usage'))).toBe(true);
        });
        it('should error on critical memory shortage', () => {
            const config = Object.assign(Object.assign({}, validConfig), { maxPreservedSessionsPerUser: 5 });
            const resourceMetrics = {
                availableMemoryMB: 50,
                activeSessions: 1000,
                cpuUsagePercent: 50
            };
            const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateResourceConstraints(config, resourceMetrics);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('memory usage'))).toBe(true);
        });
        it('should warn about high CPU usage', () => {
            const config = reconnection_config_validator_1.ReconnectionConfigValidator.getDefaultConfig();
            const resourceMetrics = {
                availableMemoryMB: 2048,
                activeSessions: 100,
                cpuUsagePercent: 85 // High CPU usage
            };
            const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateResourceConstraints(config, resourceMetrics);
            expect(result.isValid).toBe(true);
            expect(result.warnings.some(w => w.includes('CPU usage'))).toBe(true);
        });
        it('should warn about high session counts', () => {
            const config = reconnection_config_validator_1.ReconnectionConfigValidator.getDefaultConfig();
            const resourceMetrics = {
                availableMemoryMB: 2048,
                activeSessions: 1500,
                cpuUsagePercent: 50
            };
            const result = reconnection_config_validator_1.ReconnectionConfigValidator.validateResourceConstraints(config, resourceMetrics);
            expect(result.isValid).toBe(true);
            expect(result.warnings.some(w => w.includes('high session counts'))).toBe(true);
        });
    });
});
