import { LessThan } from 'typeorm';

import { Core } from '../core/core';
import { DeleteUserTask } from './delete-user-task';
import { Match, User } from '../../storage';
import { Scheduler } from '../../utils';
import { config } from '../../config';

export class CleanerTask {

  private core: Core;
  private deleteUserTask: DeleteUserTask;

  constructor(core: Core) {
    this.core = core;
    this.deleteUserTask = new DeleteUserTask();
  }

  public startTasks() {
    this.startOldMatchDelete();
    this.startOldUsersDelete();
    this.startNewUsersWithRole2Delete();
  }

  private startOldMatchDelete() {
    const scheduler = Scheduler.getInstance();
    scheduler.run(async () => {
      const keepMatchTime = config.core.keepMatchTime;
      const today = Date.now();
      const yesterday = today - keepMatchTime;
      await Match.delete({ created: LessThan(yesterday) });
    }, config.core.keepMatchIntervalCount);
  }

  // Remove inactive users with ranking equals 0.
  private startOldUsersDelete() {
    const scheduler = Scheduler.getInstance();
    scheduler.run(async () => {
      const keepMatchTime = config.core.keepUserTime;
      const today = Date.now();
      const yesterday = today - keepMatchTime;
      const onlineUserIds = this.core.clients.map(c => c.user.id);
      const usersToDelete = await User.find({
        where: {
          lastSeen: LessThan(yesterday),
          registered: LessThan(yesterday),
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
    }, config.core.keepUserIntervalCount);
  }

  // Remove users created more than 30 minutes ago with roleId 2.
  private startNewUsersWithRole2Delete() {
    const deleteTime = config.core.deleteNewUsersWithRole2Time;
    const interval = config.core.deleteNewUsersWithRole2Interval;

    if (config.core.deleteNewUsersWithRole2IntervalCount === 0) {
      return;
    }

    const deleteExpiredUsers = async () => {
      const today = Date.now();
      const cutoffTime = today - deleteTime;
      const usersToDelete = await User.find({
        where: {
          registered: LessThan(cutoffTime),
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
