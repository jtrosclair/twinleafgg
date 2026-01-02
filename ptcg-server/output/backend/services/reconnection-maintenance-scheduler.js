"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectionMaintenanceScheduler = void 0;
const scheduler_1 = require("../../utils/scheduler");
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
class ReconnectionMaintenanceScheduler {
    constructor(cleanupService) {
        this.tasks = new Map();
        this.isInitialized = false;
        this.scheduler = scheduler_1.Scheduler.getInstance();
        this.cleanupService = cleanupService;
        this.initializeTasks();
    }
    /**
     * Initialize maintenance tasks
     */
    initializeTasks() {
        // Task 1: Cleanup expired sessions (every 5 scheduler ticks = ~5 days with default 24h interval)
        this.addTask({
            name: 'cleanup-expired-sessions',
            description: 'Clean up expired disconnected sessions and preserved game states',
            intervalCount: 5,
            lastExecuted: 0,
            isEnabled: true,
            execute: async () => {
                await this.cleanupService.performScheduledCleanup();
            }
        });
        // Task 2: Database maintenance (every 7 scheduler ticks = ~7 days)
        this.addTask({
            name: 'database-maintenance',
            description: 'Optimize database tables and perform maintenance',
            intervalCount: 7,
            lastExecuted: 0,
            isEnabled: true,
            execute: async () => {
                await this.cleanupService.performDatabaseMaintenance();
            }
        });
        // Task 3: Memory cleanup (every 2 scheduler ticks = ~2 days)
        this.addTask({
            name: 'memory-cleanup',
            description: 'Perform memory cleanup and garbage collection if needed',
            intervalCount: 2,
            lastExecuted: 0,
            isEnabled: true,
            execute: async () => {
                await this.cleanupService.performMemoryCleanup();
            }
        });
        // Task 4: Metrics reset (every 30 scheduler ticks = ~30 days)
        this.addTask({
            name: 'metrics-reset',
            description: 'Reset cleanup metrics to prevent overflow',
            intervalCount: 30,
            lastExecuted: 0,
            isEnabled: true,
            execute: async () => {
                this.cleanupService.resetMetrics();
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.INFO,
                    category: 'maintenance',
                    message: 'Cleanup metrics reset by scheduled task'
                });
            }
        });
        // Task 5: Health check (every scheduler tick = daily)
        this.addTask({
            name: 'health-check',
            description: 'Check health status of cleanup service and log warnings',
            intervalCount: 1,
            lastExecuted: 0,
            isEnabled: true,
            execute: async () => {
                await this.performHealthCheck();
            }
        });
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'maintenance',
            message: 'Maintenance tasks initialized',
            data: {
                taskCount: this.tasks.size,
                tasks: Array.from(this.tasks.keys())
            }
        });
    }
    /**
     * Start the maintenance scheduler
     */
    start() {
        if (this.isInitialized) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.WARN,
                category: 'maintenance',
                message: 'Maintenance scheduler already started'
            });
            return;
        }
        // Register with the main scheduler
        // Use interval count of 1 to check every scheduler tick (daily by default)
        this.scheduler.run(this.executeTasks.bind(this), 1);
        this.isInitialized = true;
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'maintenance',
            message: 'Maintenance scheduler started',
            data: {
                schedulerInterval: config_1.config.core.schedulerInterval,
                enabledTasks: Array.from(this.tasks.values())
                    .filter(task => task.isEnabled)
                    .map(task => task.name)
            }
        });
    }
    /**
     * Stop the maintenance scheduler
     */
    stop() {
        if (!this.isInitialized) {
            return;
        }
        this.scheduler.stop(this.executeTasks.bind(this));
        this.isInitialized = false;
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'maintenance',
            message: 'Maintenance scheduler stopped'
        });
    }
    /**
     * Execute maintenance tasks that are due
     */
    async executeTasks() {
        const startTime = Date.now();
        const executedTasks = [];
        try {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.DEBUG,
                category: 'maintenance',
                message: 'Checking maintenance tasks'
            });
            for (const [taskName, task] of this.tasks) {
                if (!task.isEnabled) {
                    continue;
                }
                // Check if task is due for execution
                const ticksSinceLastExecution = this.getTicksSinceLastExecution(task.lastExecuted);
                if (ticksSinceLastExecution >= task.intervalCount) {
                    try {
                        logger_1.logger.logStructured({
                            level: logger_1.LogLevel.INFO,
                            category: 'maintenance',
                            message: `Executing maintenance task: ${taskName}`,
                            data: {
                                description: task.description,
                                ticksSinceLastExecution,
                                intervalCount: task.intervalCount
                            }
                        });
                        const taskStartTime = Date.now();
                        await task.execute();
                        const taskDuration = Date.now() - taskStartTime;
                        task.lastExecuted = Date.now();
                        executedTasks.push(taskName);
                        logger_1.logger.logStructured({
                            level: logger_1.LogLevel.INFO,
                            category: 'maintenance',
                            message: `Maintenance task completed: ${taskName}`,
                            data: {
                                durationMs: taskDuration
                            }
                        });
                    }
                    catch (error) {
                        logger_1.logger.logStructured({
                            level: logger_1.LogLevel.ERROR,
                            category: 'maintenance',
                            message: `Error executing maintenance task: ${taskName}`,
                            data: {
                                description: task.description
                            },
                            error: error
                        });
                    }
                }
            }
            const totalDuration = Date.now() - startTime;
            if (executedTasks.length > 0) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.INFO,
                    category: 'maintenance',
                    message: 'Maintenance tasks execution completed',
                    data: {
                        executedTasks,
                        totalDurationMs: totalDuration
                    }
                });
            }
        }
        catch (error) {
            const totalDuration = Date.now() - startTime;
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'maintenance',
                message: 'Error during maintenance tasks execution',
                data: {
                    totalDurationMs: totalDuration
                },
                error: error
            });
        }
    }
    /**
     * Add a maintenance task
     */
    addTask(task) {
        this.tasks.set(task.name, task);
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'maintenance',
            message: `Added maintenance task: ${task.name}`,
            data: {
                description: task.description,
                intervalCount: task.intervalCount,
                isEnabled: task.isEnabled
            }
        });
    }
    /**
     * Remove a maintenance task
     */
    removeTask(taskName) {
        const removed = this.tasks.delete(taskName);
        if (removed) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'maintenance',
                message: `Removed maintenance task: ${taskName}`
            });
        }
        return removed;
    }
    /**
     * Enable or disable a maintenance task
     */
    setTaskEnabled(taskName, enabled) {
        const task = this.tasks.get(taskName);
        if (!task) {
            return false;
        }
        task.isEnabled = enabled;
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'maintenance',
            message: `${enabled ? 'Enabled' : 'Disabled'} maintenance task: ${taskName}`
        });
        return true;
    }
    /**
     * Update task interval
     */
    updateTaskInterval(taskName, intervalCount) {
        const task = this.tasks.get(taskName);
        if (!task) {
            return false;
        }
        const oldInterval = task.intervalCount;
        task.intervalCount = intervalCount;
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'maintenance',
            message: `Updated maintenance task interval: ${taskName}`,
            data: {
                oldInterval,
                newInterval: intervalCount
            }
        });
        return true;
    }
    /**
     * Get all maintenance tasks
     */
    getTasks() {
        return new Map(this.tasks);
    }
    /**
     * Get task status
     */
    getTaskStatus(taskName) {
        const task = this.tasks.get(taskName);
        if (!task) {
            return null;
        }
        const ticksSinceLastExecution = this.getTicksSinceLastExecution(task.lastExecuted);
        const ticksUntilNextExecution = Math.max(0, task.intervalCount - ticksSinceLastExecution);
        const nextExecution = task.lastExecuted + (task.intervalCount * config_1.config.core.schedulerInterval);
        return {
            exists: true,
            isEnabled: task.isEnabled,
            lastExecuted: task.lastExecuted,
            nextExecution,
            ticksSinceLastExecution,
            ticksUntilNextExecution
        };
    }
    /**
     * Force execute a specific task
     */
    async forceExecuteTask(taskName) {
        const task = this.tasks.get(taskName);
        if (!task) {
            return false;
        }
        try {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'maintenance',
                message: `Force executing maintenance task: ${taskName}`,
                data: { description: task.description }
            });
            const startTime = Date.now();
            await task.execute();
            const duration = Date.now() - startTime;
            task.lastExecuted = Date.now();
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'maintenance',
                message: `Force execution completed: ${taskName}`,
                data: { durationMs: duration }
            });
            return true;
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'maintenance',
                message: `Error during force execution: ${taskName}`,
                data: { description: task.description },
                error: error
            });
            return false;
        }
    }
    /**
     * Perform health check of the cleanup service
     */
    async performHealthCheck() {
        try {
            const health = this.cleanupService.getHealthStatus();
            const metrics = this.cleanupService.getMetrics();
            if (!health.isHealthy) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.WARN,
                    category: 'health-check',
                    message: 'Cleanup service health check failed',
                    data: {
                        lastCleanupAge: health.lastCleanupAge,
                        activeOperations: health.activeOperations,
                        isShuttingDown: health.isShuttingDown
                    }
                });
            }
            // Log metrics summary
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'health-check',
                message: 'Cleanup service health check completed',
                data: {
                    isHealthy: health.isHealthy,
                    metrics: {
                        totalCleanupOperations: metrics.totalCleanupOperations,
                        expiredSessionsRemoved: metrics.expiredSessionsRemoved,
                        orphanedStatesRemoved: metrics.orphanedStatesRemoved,
                        lastCleanupTime: metrics.lastCleanupTime
                    }
                }
            });
            // Warn if cleanup hasn't run in a long time
            if (health.lastCleanupAge > 2 * 24 * 60 * 60 * 1000) { // 2 days
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.WARN,
                    category: 'health-check',
                    message: 'Cleanup service has not run recently',
                    data: {
                        lastCleanupAge: health.lastCleanupAge,
                        lastCleanupAgeHours: Math.round(health.lastCleanupAge / (60 * 60 * 1000))
                    }
                });
            }
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'health-check',
                message: 'Error during health check',
                error: error
            });
        }
    }
    /**
     * Calculate ticks since last execution
     */
    getTicksSinceLastExecution(lastExecuted) {
        if (lastExecuted === 0) {
            return Number.MAX_SAFE_INTEGER; // Never executed
        }
        const timeSinceLastExecution = Date.now() - lastExecuted;
        return Math.floor(timeSinceLastExecution / config_1.config.core.schedulerInterval);
    }
    /**
     * Get scheduler status
     */
    getStatus() {
        const tasks = Array.from(this.tasks.values()).map(task => ({
            name: task.name,
            description: task.description,
            isEnabled: task.isEnabled,
            lastExecuted: task.lastExecuted,
            intervalCount: task.intervalCount,
            nextExecution: task.lastExecuted + (task.intervalCount * config_1.config.core.schedulerInterval)
        }));
        return {
            isInitialized: this.isInitialized,
            taskCount: this.tasks.size,
            enabledTaskCount: tasks.filter(task => task.isEnabled).length,
            tasks
        };
    }
}
exports.ReconnectionMaintenanceScheduler = ReconnectionMaintenanceScheduler;
