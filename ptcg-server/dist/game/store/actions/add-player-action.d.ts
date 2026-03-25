import { Action } from './action';
export declare class AddPlayerAction implements Action {
    clientId: number;
    name: string;
    deck: string[];
    artworksMap?: {
        [code: string]: {
            imageUrl: string;
            holoType?: string;
        };
    };
    deckId?: number;
    sleeveImagePath?: string;
    readonly type: string;
    constructor(clientId: number, name: string, deck: string[], artworksMap?: {
        [code: string]: {
            imageUrl: string;
            holoType?: string;
        };
    }, deckId?: number, sleeveImagePath?: string);
}
