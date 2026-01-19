"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    backend: {
        address: 'https://sim-server.prizemap.app',
        port: 8080,
        registrationEnabled: true,
        allowCors: true,
        tokenExpire: 21600,
        defaultPageSize: 50,
        avatarsDir: '',
        avatarsUrl: '/avatars/{name}',
        avatarFileSize: 256 * 1024,
        avatarMinSize: 64,
        avatarMaxSize: 512,
        replayFileSize: 512 * 1024,
        rateLimitCount: 10000,
        wsRateLimitCount: 10000,
        rateLimitTime: 60000,
        apiUrl: 'https://sim-server.prizemap.app',
        timeout: 60 * 60 * 1000,
        production: true,
        apiVersion: 2,
        allowServerChange: true,
        refreshTokenInterval: 60 * 60 * 1000,
        enableImageCache: true,
        defaultLanguage: 'en',
        languages: { en: 'English', jp: '日本語', fr: 'Français' },
    },
    core: {
        debug: false,
        // How often should we execute the background tasks
        schedulerInterval: 24 * 60 * 60 * 1000,
        // Wait till next hour before running tasks
        schedulerStartNextHour: false,
        // Decrease players' ranking every day
        // If you wish to disable this feature set IntervalCount to 0
        rankingDecraseRate: 0.975,
        rankingDecraseTime: 7 * 24 * 60 * 60 * 1000,
        rankingDecreaseIntervalCount: 0,
        // Deletes matches older than `keepMatchTike` from the database, to keep it small.
        // If you wish to disable this feature set IntervalCount to 0
        keepMatchTime: 14 * 24 * 60 * 60 * 1000,
        keepMatchIntervalCount: 0,
        // Deletes users that doesn't log in in the `keepUserTime` and their ranking is 0
        // If you wish to disable this feature set IntervalCount to 0
        keepUserTime: 14 * 24 * 60 * 60 * 1000,
        keepUserIntervalCount: 0,
        // Deletes users created more than 30 minutes ago with roleId 2
        // If you wish to disable this feature set IntervalCount to 0
        deleteNewUsersWithRole2IntervalCount: 1,
        deleteNewUsersWithRole2Time: 30 * 60 * 1000,
        deleteNewUsersWithRole2Interval: 60 * 60 * 1000 // 1 hour
    },
    bots: {
        // Default password for bot user
        defaultPassword: 'bot',
        // Delay between every action that bot is making
        actionDelay: 1,
        // Simulate matches every X ticks of the scheduler
        // If set to 0, the bot matches are disabled
        botGamesIntervalCount: 0,
    },
    reconnection: {
        // How long to preserve game state (2 minutes)
        preservationTimeoutMs: 5 * 60 * 1000,
        // Automatic reconnection attempts
        maxAutoReconnectAttempts: 5,
        // Intervals between reconnection attempts (every 10s for up to 2 minutes)
        reconnectIntervals: [5000, 10000, 30000, 60000, 120000],
        // Connection health check interval (30 seconds)
        healthCheckIntervalMs: 30 * 1000,
        // Cleanup interval for expired sessions (1 minute)
        cleanupIntervalMs: 60 * 1000,
        // Maximum number of preserved sessions per user
        maxPreservedSessionsPerUser: 1
    },
    sets: {
        scansDir: '',
        scansUrl: '{cardImage}'
    },
    email: {
        transporter: {
            sendmail: true,
            newline: 'unix',
            path: '/usr/sbin/sendmail'
        },
        sender: 'no-reply@twinleaf.gg',
        appName: 'twinleaf',
        publicAddress: 'http://play.twinleaf.gg' // Address inside the e-mail messages
    }
};
