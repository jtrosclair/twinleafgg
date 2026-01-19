"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
const rate_limit_1 = require("../common/rate-limit");
const auth_token_1 = require("../services/auth-token");
const game_1 = require("../../game");
const logger_1 = require("../../utils/logger");
async function authMiddleware(socket, next) {
    var _a, _b, _c;
    const rateLimit = rate_limit_1.RateLimit.getInstance();
    const token = socket.handshake.query && socket.handshake.query.token;
    const reconnectionAttempt = socket.handshake.query && socket.handshake.query.reconnection;
    const userId = (0, auth_token_1.validateToken)(token);
    const ipAddress = ((_b = (_a = socket.handshake.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim())
        || (socket.request.socket.remoteAddress || ((_c = socket.request.connection) === null || _c === void 0 ? void 0 : _c.remoteAddress))
        || '0.0.0.0';
    if (rateLimit.isLimitExceeded(ipAddress)) {
        return next(new Error(errors_1.ApiErrorEnum.REQUESTS_LIMIT_REACHED));
    }
    if (userId === 0) {
        rateLimit.increment(ipAddress);
        return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
    }
    let user;
    // Handle anonymous users (negative IDs)
    if (userId < 0) {
        // Create an in-memory User object for anonymous sessions
        user = new storage_1.User();
        user.id = userId;
        user.name = `Guest_${Math.abs(userId).toString(36).substring(0, 6)}`;
        user.email = '';
        user.ranking = 1000;
        user.roleId = 2; // Regular user role
        user.registered = Date.now();
        user.lastSeen = Date.now();
        user.lastRankingChange = 0;
        user.avatarFile = '';
    }
    else {
        user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            rateLimit.increment(ipAddress);
            return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
        }
    }
    // Log reconnection attempts for monitoring
    if (reconnectionAttempt === 'true') {
        logger_1.logger.log(`[Auth] Reconnection attempt for user=${userId} from IP=${ipAddress}`);
        // Mark this socket as a reconnection attempt
        socket.isReconnectionAttempt = true;
    }
    // --- Start Deck Migration Logic ---
    // Skip deck migration for anonymous users (negative IDs)
    if (userId > 0) {
        try {
            const userDecks = await storage_1.Deck.find({ where: { user: { id: userId } } });
            const cardManager = game_1.CardManager.getInstance();
            let hasChanges = false;
            for (const deck of userDecks) {
                const cardNames = JSON.parse(deck.cards);
                let needsNameUpdate = false;
                const changedCards = [];
                const resolvedCards = cardNames.map(name => {
                    const card = cardManager.getCardByName(name);
                    if (card && card.fullName !== name) {
                        needsNameUpdate = true;
                        changedCards.push(`${name} → ${card.fullName}`);
                        return card.fullName;
                    }
                    return name;
                });
                const deckAnalyser = new game_1.DeckAnalyser(needsNameUpdate ? resolvedCards : cardNames);
                const newIsValid = deckAnalyser.isValid();
                const needsValidationUpdate = deck.isValid !== newIsValid;
                if (needsNameUpdate || needsValidationUpdate) {
                    hasChanges = true;
                    if (needsNameUpdate) {
                        deck.cards = JSON.stringify(resolvedCards);
                    }
                    if (needsValidationUpdate) {
                        deck.isValid = newIsValid;
                    }
                    await deck.save();
                    // Log specific changes for this deck
                    const changes = [];
                    if (needsNameUpdate && changedCards.length > 0) {
                        changes.push(`Card names: ${changedCards.join(', ')}`);
                    }
                    if (needsValidationUpdate) {
                        changes.push(`Validation: ${deck.isValid ? 'valid' : 'invalid'}`);
                    }
                    console.log(`Deck ${deck.id} updated for user ${userId}: ${changes.join(', ')}`);
                }
            }
            if (hasChanges) {
                console.log(`Deck migration completed for user ${userId}: Updated card names and validation status`);
            }
        }
        catch (error) {
            console.error(`Error during deck migration for user ${userId}:`, error);
        }
    }
    // --- End Deck Migration Logic ---
    socket.user = user;
    next();
}
exports.authMiddleware = authMiddleware;
