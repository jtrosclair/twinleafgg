import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Cards extends Controller {
    private cardsInfo?;
    private imageMap;
    onAll(req: Request, res: Response): Promise<void>;
    onHash(req: Request, res: Response): Promise<void>;
    private fetchImageMap;
    private buildCardsInfo;
}
