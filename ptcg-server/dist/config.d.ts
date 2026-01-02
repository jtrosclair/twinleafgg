export declare const config: {
    backend: {
        address: string;
        port: number;
        registrationEnabled: boolean;
        allowCors: boolean;
        tokenExpire: number;
        defaultPageSize: number;
        avatarsDir: string;
        avatarsUrl: string;
        avatarFileSize: number;
        avatarMinSize: number;
        avatarMaxSize: number;
        replayFileSize: number;
        rateLimitCount: number;
        wsRateLimitCount: number;
        rateLimitTime: number;
        apiUrl: string;
        timeout: number;
        production: boolean;
        apiVersion: number;
        allowServerChange: boolean;
        refreshTokenInterval: number;
        enableImageCache: boolean;
        defaultLanguage: string;
        languages: {
            en: string;
            jp: string;
            fr: string;
        };
    };
    core: {
        debug: boolean;
        schedulerInterval: number;
        schedulerStartNextHour: boolean;
        rankingDecraseRate: number;
        rankingDecraseTime: number;
        rankingDecreaseIntervalCount: number;
        keepMatchTime: number;
        keepMatchIntervalCount: number;
        keepUserTime: number;
        keepUserIntervalCount: number;
    };
    bots: {
        defaultPassword: string;
        actionDelay: number;
        botGamesIntervalCount: number;
    };
    reconnection: {
        preservationTimeoutMs: number;
        maxAutoReconnectAttempts: number;
        reconnectIntervals: number[];
        healthCheckIntervalMs: number;
        cleanupIntervalMs: number;
        maxPreservedSessionsPerUser: number;
    };
    sets: {
        scansDir: string;
        scansUrl: string;
    };
    email: {
        transporter: {
            sendmail: boolean;
            newline: string;
            path: string;
        };
        sender: string;
        appName: string;
        publicAddress: string;
    };
};
