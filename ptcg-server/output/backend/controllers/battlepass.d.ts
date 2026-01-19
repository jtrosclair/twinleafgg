import { Request, Response } from 'express';
import { Controller } from './controller';
import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';
export declare class BattlePass extends Controller {
    constructor(path: string, app: Application, db: Storage, core: Core);
    onGetCurrent(req: Request, res: Response): Promise<void>;
    onGetProgress(req: Request, res: Response): Promise<void>;
    onClaim(req: Request, res: Response): Promise<void>;
    onAddDebugExp(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    onAddExp(req: Request, res: Response): Promise<void>;
    onGetSeasons(req: Request, res: Response): Promise<void>;
}
