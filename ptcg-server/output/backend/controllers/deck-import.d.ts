import { Request, Response } from 'express';
import { Controller } from './controller';
export declare const setCodeReplacements: {
    from: string;
    to: string;
}[];
export declare class DeckImport extends Controller {
    private imageCache;
    onParse(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    onParseAndSaveUnknown(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    onGetCards(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private parseDeckList;
    private loadImageCache;
    private getCardImage;
    private getSuperTypeString;
    private getSubTypeString;
    private parseCardLine;
    private saveUnknownCards;
}
