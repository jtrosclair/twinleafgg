import { ReconnectionCleanupService } from './reconnection-cleanup.service';
export interface MaintenanceTask {
    name: string;
    description: string;
    intervalCount: number;
    lastExecuted: number;
    isEnabled: boolean;
    execute: () => Promise<void>;
}
export declare class ReconnectionMaintenanceScheduler {
    private scheduler;
    private cleanupService;
    private tasks;
    private isInitialized;
    constructor(cleanupService: ReconnectionCleanupService);
    /**
     * Initialize maintenance tasks
     */
    private initializeTasks;
    /**
     * Start the maintenance scheduler
     */
    start(): void;
    /**
     * Stop the maintenance scheduler
     */
    stop(): void;
    /**
     * Execute maintenance tasks that are due
     */
    private executeTasks;
    /**
     * Add a maintenance task
     */
    addTask(task: MaintenanceTask): void;
    /**
     * Remove a maintenance task
     */
    removeTask(taskName: string): boolean;
    /**
     * Enable or disable a maintenance task
     */
    setTaskEnabled(taskName: string, enabled: boolean): boolean;
    /**
     * Update task interval
     */
    updateTaskInterval(taskName: string, intervalCount: number): boolean;
    /**
     * Get all maintenance tasks
     */
    getTasks(): Map<string, MaintenanceTask>;
    /**
     * Get task status
     */
    getTaskStatus(taskName: string): {
        exists: boolean;
        isEnabled: boolean;
        lastExecuted: number;
        nextExecution: number;
        ticksSinceLastExecution: number;
        ticksUntilNextExecution: number;
    } | null;
    /**
     * Force execute a specific task
     */
    forceExecuteTask(taskName: string): Promise<boolean>;
    /**
     * Perform health check of the cleanup service
     */
    private performHealthCheck;
    /**
     * Calculate ticks since last execution
     */
    private getTicksSinceLastExecution;
    /**
     * Get scheduler status
     */
    getStatus(): {
        isInitialized: boolean;
        taskCount: number;
        enabledTaskCount: number;
        tasks: Array<{
            name: string;
            description: string;
            isEnabled: boolean;
            lastExecuted: number;
            intervalCount: number;
            nextExecution: number;
        }>;
    };
}
