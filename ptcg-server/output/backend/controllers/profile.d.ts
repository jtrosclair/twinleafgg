import { Request, Response } from 'express';
import { Controller } from './controller';
declare module 'express' {
    interface Request {
        user?: {
            id: number;
        };
    }
}
export declare class Profile extends Controller {
    onMe(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onMatchHistory(req: Request, res: Response): Promise<void>;
    onChangePassword(req: Request, res: Response): Promise<void>;
    onChangeEmail(req: Request, res: Response): Promise<void>;
    onGetCardImagesUrl(req: Request, res: Response): Promise<void>;
    onSetCardImagesUrl(req: Request, res: Response): Promise<void>;
    onUpdateRole(req: Request, res: Response): Promise<void>;
}
