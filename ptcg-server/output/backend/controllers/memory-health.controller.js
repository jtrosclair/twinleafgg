"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryHealthController = void 0;
const memory_optimization_service_1 = require("../services/memory-optimization.service");
const memory_monitor_service_1 = require("../services/memory-monitor.service");
const logger_1 = require("../../utils/logger");
const controller_1 = require("./controller");
class MemoryHealthController extends controller_1.Controller {
    constructor(path, app, db, core) {
        super(path, app, db, core);
        this.memoryOptimization = memory_optimization_service_1.MemoryOptimizationService.getInstance();
        this.memoryMonitor = memory_monitor_service_1.MemoryMonitorService.getInstance();
    }
    /**
     * Get current memory health status
     */
    async getMemoryHealth(req, res) {
        try {
            const memoryStats = this.memoryOptimization.getMemoryStats();
            const optimizationStatus = this.memoryOptimization.getStatus();
            const response = {
                status: 'success',
                data: {
                    current: memoryStats.current,
                    health: memoryStats.health,
                    trend: memoryStats.trend,
                    optimization: {
                        isRunning: optimizationStatus.isRunning,
                        lastOptimization: optimizationStatus.lastOptimization
                    },
                    timestamp: Date.now()
                }
            };
            res.json(response);
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'memory-health',
                message: 'Error getting memory health status',
                error: error
            });
            res.status(500).json({
                status: 'error',
                message: 'Failed to get memory health status',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get memory history and trends
     */
    async getMemoryHistory(req, res) {
        try {
            const memoryStats = this.memoryOptimization.getMemoryStats();
            const history = memoryStats.history;
            const response = {
                status: 'success',
                data: {
                    history: history.map(stat => ({
                        timestamp: stat.timestamp,
                        heapUsedMb: stat.heapUsedMb,
                        rssMb: stat.rssMb,
                        externalMb: stat.externalMb
                    })),
                    trend: memoryStats.trend,
                    count: history.length
                }
            };
            res.json(response);
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'memory-health',
                message: 'Error getting memory history',
                error: error
            });
            res.status(500).json({
                status: 'error',
                message: 'Failed to get memory history',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Force memory optimization
     */
    async forceOptimization(req, res) {
        try {
            await this.memoryOptimization.performOptimization();
            const response = {
                status: 'success',
                message: 'Memory optimization completed',
                data: {
                    timestamp: Date.now()
                }
            };
            res.json(response);
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'memory-health',
                message: 'Error during forced memory optimization',
                error: error
            });
            res.status(500).json({
                status: 'error',
                message: 'Failed to perform memory optimization',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Force garbage collection
     */
    async forceGarbageCollection(req, res) {
        try {
            const memoryFreed = this.memoryMonitor.forceGarbageCollection();
            const response = {
                status: 'success',
                message: 'Garbage collection completed',
                data: {
                    memoryFreedMb: Math.round(memoryFreed / (1024 * 1024)),
                    timestamp: Date.now()
                }
            };
            res.json(response);
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'memory-health',
                message: 'Error during forced garbage collection',
                error: error
            });
            res.status(500).json({
                status: 'error',
                message: 'Failed to perform garbage collection',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Update memory optimization configuration
     */
    async updateConfig(req, res) {
        try {
            const { config } = req.body;
            if (!config || typeof config !== 'object') {
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid configuration provided'
                });
                return;
            }
            this.memoryOptimization.updateConfig(config);
            const response = {
                status: 'success',
                message: 'Memory optimization configuration updated',
                data: {
                    config: this.memoryOptimization.getStatus().config,
                    timestamp: Date.now()
                }
            };
            res.json(response);
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'memory-health',
                message: 'Error updating memory optimization configuration',
                error: error
            });
            res.status(500).json({
                status: 'error',
                message: 'Failed to update configuration',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get memory optimization status
     */
    async getOptimizationStatus(req, res) {
        try {
            const status = this.memoryOptimization.getStatus();
            const response = {
                status: 'success',
                data: status
            };
            res.json(response);
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'memory-health',
                message: 'Error getting optimization status',
                error: error
            });
            res.status(500).json({
                status: 'error',
                message: 'Failed to get optimization status',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
__decorate([
    controller_1.Get('/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryHealthController.prototype, "getMemoryHealth", null);
__decorate([
    controller_1.Get('/history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryHealthController.prototype, "getMemoryHistory", null);
__decorate([
    controller_1.Post('/optimize'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryHealthController.prototype, "forceOptimization", null);
__decorate([
    controller_1.Post('/gc'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryHealthController.prototype, "forceGarbageCollection", null);
__decorate([
    controller_1.Post('/config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryHealthController.prototype, "updateConfig", null);
__decorate([
    controller_1.Get('/status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryHealthController.prototype, "getOptimizationStatus", null);
exports.MemoryHealthController = MemoryHealthController;
