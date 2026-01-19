import { Request, Response } from 'express';
import { Controller } from './controller';
import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';
export declare class Artworks extends Controller {
    constructor(path: string, app: Application, db: Storage, core: Core);
    onUpsertArtwork(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    onGrantArtwork(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    onGetUnlockedArtworks(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
