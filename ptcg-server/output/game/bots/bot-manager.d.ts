import { BotClient } from './bot-client';
import { Core } from '../core/core';
import { Format } from '../store/card/card-types';
export declare class BotManager {
    private static instance;
    private bots;
    private botGameArranger;
    static getInstance(): BotManager;
    registerBot(bot: BotClient): void;
    getBotsForFormat(format: Format): BotClient[];
    initBots(core: Core): Promise<void>;
    getBot(botName: string): BotClient;
    private findOrCreateUser;
}
