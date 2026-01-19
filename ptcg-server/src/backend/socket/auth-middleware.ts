import { Socket } from 'socket.io';

import { ApiErrorEnum } from '../common/errors';
import { User, Deck } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { validateToken } from '../services/auth-token';
import { CardManager, DeckAnalyser } from '../../game';
import { logger } from '../../utils/logger';

export async function authMiddleware(socket: Socket, next: (err?: any) => void): Promise<void> {
  const rateLimit = RateLimit.getInstance();
  const token: string = socket.handshake.query && socket.handshake.query.token as string;
  const reconnectionAttempt: string = socket.handshake.query && socket.handshake.query.reconnection as string;
  const userId = validateToken(token);
  const ipAddress: string = (socket.handshake.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || (socket.request.socket.remoteAddress || (socket.request.connection as any)?.remoteAddress)
    || '0.0.0.0';

  if (rateLimit.isLimitExceeded(ipAddress)) {
    return next(new Error(ApiErrorEnum.REQUESTS_LIMIT_REACHED));
  }

  if (userId === 0) {
    rateLimit.increment(ipAddress);
    return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
  }

  let user: User | undefined;

  // Handle anonymous users (negative IDs)
  if (userId < 0) {
    // Create an in-memory User object for anonymous sessions
    user = new User();
    user.id = userId;
    user.name = `Guest_${Math.abs(userId).toString(36).substring(0, 6)}`;
    user.email = '';
    user.ranking = 1000;
    user.roleId = 2; // Regular user role
    user.registered = Date.now();
    user.lastSeen = Date.now();
    user.lastRankingChange = 0;
    user.avatarFile = '';
  } else {
    user = await User.findOne(userId);
    if (user === undefined) {
      rateLimit.increment(ipAddress);
      return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
    }
  }

  // Log reconnection attempts for monitoring
  if (reconnectionAttempt === 'true') {
    logger.log(`[Auth] Reconnection attempt for user=${userId} from IP=${ipAddress}`);
    // Mark this socket as a reconnection attempt
    (socket as any).isReconnectionAttempt = true;
  }

  (socket as any).user = user;
  next();
}