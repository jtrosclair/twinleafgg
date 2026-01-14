import { Core } from '../core/core';
export declare class CleanerTask {
    private core;
    private deleteUserTask;
    constructor(core: Core);
    startTasks(): void;
    private startOldMatchDelete;
    private startOldUsersDelete;
    private startNewUsersWithRole2Delete;
}
