import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Game extends Controller {
    onLogs(req: Request, res: Response): Promise<void>;
    onPlayerStats(req: Request, res: Response): Promise<void>;
    onValidateCards(req: Request, res: Response): Promise<void>;
    onExtractDecklists(req: Request, res: Response): Promise<void>;
    private collectAllCards;
    private formatDecklist;
    onValidateState(req: Request, res: Response): Promise<void>;
}
