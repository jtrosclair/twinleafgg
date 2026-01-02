import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Avatars extends Controller {
    onGetAvailable(req: Request, res: Response): Promise<void>;
    private getAvatarNameFromId;
    private getAvatarFileNameFromId;
    onList(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onFind(req: Request, res: Response): Promise<void>;
    onMarkAsDefault(req: Request, res: Response): Promise<void>;
}
