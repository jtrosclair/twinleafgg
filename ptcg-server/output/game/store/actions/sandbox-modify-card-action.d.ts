import { Action } from './action';
export declare enum CardZone {
    HAND = "hand",
    DECK = "deck",
    DISCARD = "discard",
    LOSTZONE = "lostzone",
    PRIZES = "prizes",
    STADIUM = "stadium",
    SUPPORTER = "supporter"
}
export declare class SandboxModifyCardAction implements Action {
    clientId: number;
    targetPlayerId: number;
    action: 'add' | 'remove' | 'move';
    cardName: string;
    fromZone?: CardZone;
    toZone?: CardZone;
    fromIndex?: number;
    toIndex?: number;
    prizeIndex?: number;
    readonly type: string;
    constructor(clientId: number, targetPlayerId: number, action: 'add' | 'remove' | 'move', cardName: string, fromZone?: CardZone, toZone?: CardZone, fromIndex?: number, toIndex?: number, prizeIndex?: number);
}
