import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Format } from '../../game';
import { SocketWrapper, Response } from './socket-wrapper';
import { Message } from '../../storage';
export declare class MatchmakingSocket {
    private client;
    private socket;
    private core;
    private matchmakingService;
    constructor(client: Client, socket: SocketWrapper, core: Core);
    onJoinQueue(from: Client, message: Message): void;
    onLeaveQueue(): void;
    getQueueData(response: Response<{
        players: string[];
        formatCounts: {
            [format: number]: number;
        };
    }>): void;
    joinQueue(params: {
        format: Format;
        deck: string[];
        artworks?: {
            code: string;
            artworkId?: number;
        }[];
        deckId?: number;
    }, response: Response<void>): void;
    private leaveQueue;
    dispose(): void;
}
