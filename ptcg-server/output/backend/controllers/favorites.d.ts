import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Favorites extends Controller {
    onList(req: Request, res: Response): Promise<void>;
    onSet(req: Request, res: Response): Promise<void>;
    onClear(req: Request, res: Response): Promise<void>;
}
