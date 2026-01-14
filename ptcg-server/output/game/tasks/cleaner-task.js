"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanerTask = void 0;
const typeorm_1 = require("typeorm");
const delete_user_task_1 = require("./delete-user-task");
const storage_1 = require("../../storage");
const utils_1 = require("../../utils");
const config_1 = require("../../config");
class CleanerTask {
    constructor(core) {
        this.core = core;
        this.deleteUserTask = new delete_user_task_1.DeleteUserTask();
    }
    startTasks() {
        this.startOldMatchDelete();
        this.startOldUsersDelete();
        this.startNewUsersWithRole2Delete();
    }
    startOldMatchDelete() {
        const scheduler = utils_1.Scheduler.getInstance();
        scheduler.run(async () => {
            const keepMatchTime = config_1.config.core.keepMatchTime;
            const today = Date.now();
            const yesterday = today - keepMatchTime;
            await storage_1.Match.delete({ created: typeorm_1.LessThan(yesterday) });
        }, config_1.config.core.keepMatchIntervalCount);
    }
    // Remove inactive users with ranking equals 0.
    startOldUsersDelete() {
        const scheduler = utils_1.Scheduler.getInstance();
        scheduler.run(async () => {
            const keepMatchTime = config_1.config.core.keepUserTime;
            const today = Date.now();
            const yesterday = today - keepMatchTime;
            const onlineUserIds = this.core.clients.map(c => c.user.id);
            const usersToDelete = await storage_1.User.find({
                where: {
                    lastSeen: typeorm_1.LessThan(yesterday),
                    registered: typeorm_1.LessThan(yesterday),
                    ranking: 0
                },
                relations: ['decks']
            });
            for (let i = 0; i < usersToDelete.length; i++) {
                const user = usersToDelete[i];
                const userId = usersToDelete[i].id;
                if (!onlineUserIds.includes(userId) && user.decks.length === 0) {
                    await this.deleteUserTask.deleteUser(userId);
                }
            }
        }, config_1.config.core.keepUserIntervalCount);
    }
    // Remove users created more than 30 minutes ago with roleId 2.
    startNewUsersWithRole2Delete() {
        const deleteTime = config_1.config.core.deleteNewUsersWithRole2Time;
        const interval = config_1.config.core.deleteNewUsersWithRole2Interval;
        if (config_1.config.core.deleteNewUsersWithRole2IntervalCount === 0) {
            return;
        }
        const deleteExpiredUsers = async () => {
            const today = Date.now();
            const cutoffTime = today - deleteTime;
            const usersToDelete = await storage_1.User.find({
                where: {
                    registered: typeorm_1.LessThan(cutoffTime),
                    roleId: 2
                }
            });
            for (let i = 0; i < usersToDelete.length; i++) {
                await this.deleteUserTask.deleteUser(usersToDelete[i].id);
            }
        };
        deleteExpiredUsers().catch(error => console.error('Error deleting role 2 users:', error));
        setInterval(deleteExpiredUsers, interval).unref();
    }
}
exports.CleanerTask = CleanerTask;
