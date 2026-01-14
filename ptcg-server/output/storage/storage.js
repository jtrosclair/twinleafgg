"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const _1 = require("./");
class Storage {
    constructor() {
        this.connection = null;
    }
    async connect() {
        const storageConfig = {
            type: process.env.STORAGE_TYPE,
            host: process.env.STORAGE_HOST,
            port: process.env.STORAGE_PORT,
            username: process.env.STORAGE_USERNAME,
            password: process.env.STORAGE_DATABASE_PASSWORD,
            database: process.env.STORAGE_DATABASE
        };
        this.connection = await typeorm_1.createConnection(Object.assign(Object.assign({}, storageConfig), { timezone: 'Z', entities: [
                _1.Avatar,
                _1.Conversation,
                _1.Deck,
                _1.DisconnectedSession,
                _1.Friend,
                _1.FriendRequest,
                _1.Match,
                _1.Message,
                _1.Replay,
                _1.User,
                _1.BattlePassSeason,
                _1.UserBattlePass,
                _1.UserUnlockedItem,
                _1.CardArtwork,
                _1.UserFavoriteCard
            ], synchronize: false, logging: false }));
        console.log({
            type: process.env.STORAGE_TYPE,
            host: process.env.STORAGE_HOST,
        });
        // For SQLite, manually handle synchronization with foreign keys disabled
        if (storageConfig.type === 'sqlite') {
            await this.connection.query('PRAGMA foreign_keys = OFF');
            await this.connection.synchronize();
            await this.connection.query('PRAGMA foreign_keys = ON');
        }
    }
    async disconnect() {
        if (this.connection === null) {
            return;
        }
        return this.connection.close();
    }
    get manager() {
        if (this.connection === null) {
            throw new Error('Not connected to the database.');
        }
        return this.connection.manager;
    }
    async checkConnection() {
        if (this.connection === null) {
            return false;
        }
        try {
            await this.connection.query('SELECT 1');
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.Storage = Storage;
