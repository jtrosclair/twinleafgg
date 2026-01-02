"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reconnection_maintenance_scheduler_1 = require("./reconnection-maintenance-scheduler");
describe('ReconnectionMaintenanceScheduler', () => {
    let maintenanceScheduler;
    let mockCleanupService;
    beforeEach(() => {
        // Create mock cleanup service
        mockCleanupService = jasmine.createSpyObj('ReconnectionCleanupService', [
            'performScheduledCleanup',
            'performDatabaseMaintenance',
            'performMemoryCleanup',
            'resetMetrics',
            'getHealthStatus',
            'getMetrics'
        ]);
        mockCleanupService.performScheduledCleanup.and.returnValue(Promise.resolve());
        mockCleanupService.performDatabaseMaintenance.and.returnValue(Promise.resolve());
        mockCleanupService.performMemoryCleanup.and.returnValue(Promise.resolve(0));
        mockCleanupService.getHealthStatus.and.returnValue({
            isHealthy: true,
            lastCleanupAge: 1000,
            activeOperations: 0,
            isShuttingDown: false,
            metrics: {}
        });
        mockCleanupService.getMetrics.and.returnValue({
            totalCleanupOperations: 10,
            expiredSessionsRemoved: 5,
            orphanedStatesRemoved: 3,
            lastCleanupTime: Date.now() - 1000
        });
        maintenanceScheduler = new reconnection_maintenance_scheduler_1.ReconnectionMaintenanceScheduler(mockCleanupService);
    });
    describe('constructor', () => {
        it('should initialize with default maintenance tasks', () => {
            const tasks = maintenanceScheduler.getTasks();
            expect(tasks.size).toBeGreaterThan(0);
            expect(tasks.has('cleanup-expired-sessions')).toBe(true);
            expect(tasks.has('database-maintenance')).toBe(true);
            expect(tasks.has('memory-cleanup')).toBe(true);
            expect(tasks.has('metrics-reset')).toBe(true);
            expect(tasks.has('health-check')).toBe(true);
        });
    });
    describe('task management', () => {
        it('should add a new task', () => {
            const newTask = {
                name: 'test-task',
                description: 'Test task',
                intervalCount: 5,
                lastExecuted: 0,
                isEnabled: true,
                execute: jasmine.createSpy('execute').and.returnValue(Promise.resolve())
            };
            maintenanceScheduler.addTask(newTask);
            const tasks = maintenanceScheduler.getTasks();
            expect(tasks.has('test-task')).toBe(true);
        });
        it('should remove a task', () => {
            const result = maintenanceScheduler.removeTask('health-check');
            expect(result).toBe(true);
            const tasks = maintenanceScheduler.getTasks();
            expect(tasks.has('health-check')).toBe(false);
        });
        it('should return false when removing non-existent task', () => {
            const result = maintenanceScheduler.removeTask('non-existent');
            expect(result).toBe(false);
        });
        it('should enable/disable tasks', () => {
            const result = maintenanceScheduler.setTaskEnabled('health-check', false);
            expect(result).toBe(true);
            const tasks = maintenanceScheduler.getTasks();
            const healthCheckTask = tasks.get('health-check');
            expect(healthCheckTask === null || healthCheckTask === void 0 ? void 0 : healthCheckTask.isEnabled).toBe(false);
        });
        it('should return false when enabling/disabling non-existent task', () => {
            const result = maintenanceScheduler.setTaskEnabled('non-existent', false);
            expect(result).toBe(false);
        });
        it('should update task interval', () => {
            const result = maintenanceScheduler.updateTaskInterval('health-check', 10);
            expect(result).toBe(true);
            const tasks = maintenanceScheduler.getTasks();
            const healthCheckTask = tasks.get('health-check');
            expect(healthCheckTask === null || healthCheckTask === void 0 ? void 0 : healthCheckTask.intervalCount).toBe(10);
        });
        it('should return false when updating interval of non-existent task', () => {
            const result = maintenanceScheduler.updateTaskInterval('non-existent', 10);
            expect(result).toBe(false);
        });
    });
    describe('force execution', () => {
        it('should force execute a specific task', async () => {
            const testTask = {
                name: 'force-test',
                description: 'Force test task',
                intervalCount: 100,
                lastExecuted: Date.now() - 1000,
                isEnabled: true,
                execute: jasmine.createSpy('execute').and.returnValue(Promise.resolve())
            };
            maintenanceScheduler.addTask(testTask);
            const result = await maintenanceScheduler.forceExecuteTask('force-test');
            expect(result).toBe(true);
            expect(testTask.execute).toHaveBeenCalled();
            expect(testTask.lastExecuted).toBeGreaterThan(Date.now() - 1000);
        });
        it('should return false for non-existent task', async () => {
            const result = await maintenanceScheduler.forceExecuteTask('non-existent');
            expect(result).toBe(false);
        });
        it('should handle force execution errors', async () => {
            const errorTask = {
                name: 'force-error',
                description: 'Force error task',
                intervalCount: 1,
                lastExecuted: 0,
                isEnabled: true,
                execute: jasmine.createSpy('execute').and.returnValue(Promise.reject(new Error('Force execution failed')))
            };
            maintenanceScheduler.addTask(errorTask);
            const result = await maintenanceScheduler.forceExecuteTask('force-error');
            expect(result).toBe(false);
        });
    });
    describe('task status', () => {
        it('should return task status for existing task', () => {
            const status = maintenanceScheduler.getTaskStatus('health-check');
            expect(status).not.toBeNull();
            expect(status === null || status === void 0 ? void 0 : status.exists).toBe(true);
            expect(status === null || status === void 0 ? void 0 : status.isEnabled).toBe(true);
            expect(typeof (status === null || status === void 0 ? void 0 : status.lastExecuted)).toBe('number');
            expect(typeof (status === null || status === void 0 ? void 0 : status.nextExecution)).toBe('number');
            expect(typeof (status === null || status === void 0 ? void 0 : status.ticksSinceLastExecution)).toBe('number');
            expect(typeof (status === null || status === void 0 ? void 0 : status.ticksUntilNextExecution)).toBe('number');
        });
        it('should return null for non-existent task', () => {
            const status = maintenanceScheduler.getTaskStatus('non-existent');
            expect(status).toBeNull();
        });
    });
    describe('status reporting', () => {
        it('should return scheduler status', () => {
            const status = maintenanceScheduler.getStatus();
            expect(typeof status.isInitialized).toBe('boolean');
            expect(typeof status.taskCount).toBe('number');
            expect(typeof status.enabledTaskCount).toBe('number');
            expect(Array.isArray(status.tasks)).toBe(true);
            expect(status.taskCount).toBeGreaterThan(0);
        });
        it('should include task details in status', () => {
            const status = maintenanceScheduler.getStatus();
            expect(status.tasks.length).toBeGreaterThan(0);
            const firstTask = status.tasks[0];
            expect(typeof firstTask.name).toBe('string');
            expect(typeof firstTask.description).toBe('string');
            expect(typeof firstTask.isEnabled).toBe('boolean');
            expect(typeof firstTask.lastExecuted).toBe('number');
            expect(typeof firstTask.intervalCount).toBe('number');
            expect(typeof firstTask.nextExecution).toBe('number');
        });
    });
    describe('default tasks execution', () => {
        it('should execute cleanup-expired-sessions task', async () => {
            const tasks = maintenanceScheduler.getTasks();
            const cleanupTask = tasks.get('cleanup-expired-sessions');
            if (cleanupTask) {
                await cleanupTask.execute();
            }
            expect(mockCleanupService.performScheduledCleanup).toHaveBeenCalled();
        });
        it('should execute database-maintenance task', async () => {
            const tasks = maintenanceScheduler.getTasks();
            const maintenanceTask = tasks.get('database-maintenance');
            if (maintenanceTask) {
                await maintenanceTask.execute();
            }
            expect(mockCleanupService.performDatabaseMaintenance).toHaveBeenCalled();
        });
        it('should execute memory-cleanup task', async () => {
            const tasks = maintenanceScheduler.getTasks();
            const memoryTask = tasks.get('memory-cleanup');
            if (memoryTask) {
                await memoryTask.execute();
            }
            expect(mockCleanupService.performMemoryCleanup).toHaveBeenCalled();
        });
        it('should execute metrics-reset task', async () => {
            const tasks = maintenanceScheduler.getTasks();
            const metricsTask = tasks.get('metrics-reset');
            if (metricsTask) {
                await metricsTask.execute();
            }
            expect(mockCleanupService.resetMetrics).toHaveBeenCalled();
        });
        it('should execute health-check task', async () => {
            const tasks = maintenanceScheduler.getTasks();
            const healthTask = tasks.get('health-check');
            if (healthTask) {
                await healthTask.execute();
            }
            expect(mockCleanupService.getHealthStatus).toHaveBeenCalled();
            expect(mockCleanupService.getMetrics).toHaveBeenCalled();
        });
    });
});
