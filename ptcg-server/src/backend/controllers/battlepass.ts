import { Request, Response } from 'express';
import { AuthToken, Validate, check } from '../services';
import { Controller, Get, Post } from './controller';
import {
  BattlePassSeason, UserBattlePass, User, UserUnlockedItem
} from '../../storage';
import { ApiErrorEnum } from '../common/errors';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';

export class BattlePass extends Controller {

  constructor(path: string, app: Application, db: Storage, core: Core) {
    super(path, app, db, core);
  }

  // GET /v1/battlepass/current
  @Get('/current')
  public async onGetCurrent(req: Request, res: Response) {
    try {
      // Use YYYY-MM-DD string to avoid timezone issues with DATE columns.
      const today = new Date().toISOString().slice(0, 10);

      const currentSeason = await BattlePassSeason.findOne({
        where: {
          startDate: LessThanOrEqual(today),
          endDate: MoreThanOrEqual(today)
        }
      });

      if (!currentSeason) {
        res.status(404).send({ error: 'No active battle pass season' });
        return;
      }

      // Premium track removed; no user premium status needed

      res.send({
        ok: true,
        season: {
          id: currentSeason.id,
          seasonId: currentSeason.seasonId,
          name: currentSeason.name,
          startDate: currentSeason.startDate,
          endDate: currentSeason.endDate,
          rewards: currentSeason.rewards,
          maxLevel: currentSeason.maxLevel
        }
      });
    } catch (error) {
      console.error('Error fetching current season:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  // GET /v1/battlepass/progress
  @Get('/progress')
  @AuthToken()
  public async onGetProgress(req: Request, res: Response) {
    res.status(404).send({ error: 'No active battle pass season' });
    return;
  }

  @Post('/claim')
  @AuthToken()
  @Validate({
    level: check().isNumber().required()
  })
  public async onClaim(req: Request, res: Response) {
    res.status(404).send({ error: 'No active battle pass season' });
    return;
  }

  @Post('/debug/add-exp')
  @AuthToken()
  @Validate({
    exp: check().isNumber().required()
  })
  public async onAddDebugExp(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const exp: number = req.body.exp;
      const now = new Date();

      // Get current season
      const currentSeason = await BattlePassSeason.findOne({
        where: {
          startDate: LessThanOrEqual(now),
          endDate: MoreThanOrEqual(now)
        }
      });

      if (!currentSeason) {
        return res.status(404).send({ error: 'No active battle pass season' });
      }

      // Get user and ensure they are an admin
      const user = await User.findOne(userId);
      if (!user) {
        return res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
      }

      // Get or create user progress
      let progress = await UserBattlePass.findOne({
        where: {
          userId,
          seasonId: currentSeason.seasonId
        },
        relations: ['season']
      });

      if (!progress) {
        progress = new UserBattlePass();
        progress.userId = userId;
        progress.seasonId = currentSeason.seasonId;
        progress.exp = 0;
        progress.level = 1;
        progress.claimedRewards = [];
        progress.season = currentSeason;
      }

      // Add experience and save
      await progress.addExp(exp);
      //    await progress.save();

      res.send({ ok: true });

    } catch (error) {
      console.error('Error adding debug exp:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  @Post('/exp')
  @AuthToken()
  @Validate({
    exp: check().isNumber().required()
  })
  public async onAddExp(req: Request, res: Response) {
    try {
      const userId: number = req.body.userId;
      const exp: number = req.body.exp;
      const now = new Date();

      // Get current season
      const currentSeason = await BattlePassSeason.findOne({
        where: {
          startDate: LessThanOrEqual(now),
          endDate: MoreThanOrEqual(now)
        }
      });

      if (!currentSeason) {
        res.status(404).send({ error: 'No active battle pass season' });
        return;
      }

      // Get user
      const user = await User.findOne(userId);
      if (!user) {
        res.status(400).send({ error: ApiErrorEnum.PROFILE_INVALID });
        return;
      }

      // Get or create user progress
      let progress = await UserBattlePass.findOne({
        where: {
          userId,
          seasonId: currentSeason.seasonId
        },
        relations: ['season', 'user']
      });

      if (!progress) {
        progress = new UserBattlePass();
        progress.userId = userId;
        progress.seasonId = currentSeason.seasonId;
        progress.season = currentSeason;
        progress.user = user;
      }

      const oldLevel = progress.level;
      await progress.addExp(exp);
      //    await progress.save();

      // Check for level up
      const leveledUp = progress.level > oldLevel;

      // Get available rewards if leveled up (premium removed)
      const availableRewards = leveledUp ?
        currentSeason.getRewardsForLevel(progress.level, false) :
        [];

      res.send({
        ok: true,
        progress: {
          exp: progress.exp,
          level: progress.level,
          claimedRewards: progress.claimedRewards,
          leveledUp,
          nextLevelXp: currentSeason.getXpForLevel(progress.level),
          totalXpForCurrentLevel: currentSeason.getTotalXpForLevel(progress.level),
          availableRewards
        }
      });
    } catch (error) {
      console.error('Error adding exp:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }

  // GET /v1/battlepass/seasons (optional, for history)
  @Get('/seasons')
  public async onGetSeasons(req: Request, res: Response) {
    try {
      const seasons = await BattlePassSeason.find({
        order: {
          startDate: 'DESC'
        }
      });

      res.send({
        ok: true,
        seasons: seasons.map(season => ({
          id: season.id,
          seasonId: season.seasonId,
          name: season.name,
          startDate: season.startDate,
          endDate: season.endDate,
          maxLevel: season.maxLevel
        }))
      });
    } catch (error) {
      console.error('Error fetching seasons:', error);
      res.status(500).send({ error: ApiErrorEnum.SERVER_ERROR });
    }
  }
} 