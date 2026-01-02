"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_state_preserver_1 = require("./game-state-preserver");
const disconnected_session_1 = require("../../storage/model/disconnected-session");
const state_1 = require("../../game/store/state/state");
const player_1 = require("../../game/store/state/player");
const game_error_1 = require("../../game/game-error");
describe('GameStatePreserver', () => {
    let gameStatePreserver;
    let mockConfig;
    let mockState;
    beforeEach(() => {
        mockConfig = {
            preservationTimeoutMs: 300000,
            maxPreservedSessionsPerUser: 1,
            maxSerializedStateSize: 1024 * 1024,
            compressionEnabled: true
        };
        gameStatePreserver = new game_state_preserver_1.GameStatePreserver(mockConfig);
        // Create a mock state
        mockState = new state_1.State();
        mockState.phase = state_1.GamePhase.PLAYER_TURN;
        mockState.turn = 1;
        mockState.activePlayer = 0;
        mockState.winner = state_1.GameWinner.NONE;
        mockState.players = [new player_1.Player(), new player_1.Player()];
        // Mock DisconnectedSession static methods
        spyOn(disconnected_session_1.DisconnectedSession, 'findOne').and.returnValue(Promise.resolve(null));
        spyOn(disconnected_session_1.DisconnectedSession, 'find').and.returnValue(Promise.resolve([]));
        spyOn(disconnected_session_1.DisconnectedSession.prototype, 'save').and.returnValue(Promise.resolve());
        spyOn(disconnected_session_1.DisconnectedSession.prototype, 'remove').and.returnValue(Promise.resolve());
    });
    describe('preserveGameState', () => {
        it('should create a new disconnected session when none exists', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            // when
            await gameStatePreserver.preserveGameState(gameId, userId, mockState);
            // then
            expect(disconnected_session_1.DisconnectedSession.findOne).toHaveBeenCalledWith({
                where: { userId, gameId }
            });
            expect(disconnected_session_1.DisconnectedSession.prototype.save).toHaveBeenCalled();
        });
        it('should update existing disconnected session when one exists', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const existingSession = new disconnected_session_1.DisconnectedSession();
            existingSession.id = 1;
            existingSession.userId = userId;
            existingSession.gameId = gameId;
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.resolve(existingSession));
            // when
            await gameStatePreserver.preserveGameState(gameId, userId, mockState);
            // then
            expect(disconnected_session_1.DisconnectedSession.findOne).toHaveBeenCalledWith({
                where: { userId, gameId }
            });
            expect(existingSession.save).toHaveBeenCalled();
        });
        it('should set correct expiration time', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const startTime = Date.now();
            // when
            await gameStatePreserver.preserveGameState(gameId, userId, mockState);
            // then
            const savedSession = disconnected_session_1.DisconnectedSession.prototype.save.calls.mostRecent().object;
            expect(savedSession.expiresAt).toBeGreaterThanOrEqual(startTime + mockConfig.preservationTimeoutMs);
        });
        it('should set game phase and player turn correctly', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            mockState.phase = state_1.GamePhase.ATTACK;
            mockState.activePlayer = 1;
            // when
            await gameStatePreserver.preserveGameState(gameId, userId, mockState);
            // then
            const savedSession = disconnected_session_1.DisconnectedSession.prototype.save.calls.mostRecent().object;
            expect(savedSession.gamePhase).toBe(state_1.GamePhase.ATTACK.toString());
            expect(savedSession.isPlayerTurn).toBe(false); // Since getPlayerIndex returns 0 and activePlayer is 1
        });
        it('should enforce session limits per user', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const oldSession = new disconnected_session_1.DisconnectedSession();
            oldSession.disconnectedAt = Date.now() - 1000;
            disconnected_session_1.DisconnectedSession.find.and.returnValue(Promise.resolve([oldSession]));
            // when
            await gameStatePreserver.preserveGameState(gameId, userId, mockState);
            // then
            expect(oldSession.remove).toHaveBeenCalled();
        });
        it('should throw GameError when serialization fails', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const invalidState = null;
            // when & then
            try {
                await gameStatePreserver.preserveGameState(gameId, userId, invalidState);
                fail('Expected GameError to be thrown');
            }
            catch (error) {
                expect(error instanceof game_error_1.GameError).toBe(true);
            }
        });
    });
    describe('getPreservedState', () => {
        it('should return null when no session exists', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            // when
            const result = await gameStatePreserver.getPreservedState(gameId, userId);
            // then
            expect(result).toBeNull();
            expect(disconnected_session_1.DisconnectedSession.findOne).toHaveBeenCalledWith({
                where: { userId, gameId }
            });
        });
        it('should return null and cleanup when session is expired', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const expiredSession = new disconnected_session_1.DisconnectedSession();
            expiredSession.expiresAt = Date.now() - 1000; // Expired 1 second ago
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.resolve(expiredSession));
            // when
            const result = await gameStatePreserver.getPreservedState(gameId, userId);
            // then
            expect(result).toBeNull();
            expect(expiredSession.remove).toHaveBeenCalled();
        });
        it('should return preserved state when session is valid', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const validSession = new disconnected_session_1.DisconnectedSession();
            validSession.gameId = gameId;
            validSession.userId = userId;
            validSession.expiresAt = Date.now() + 300000; // Expires in 5 minutes
            validSession.disconnectedAt = Date.now() - 1000;
            // Mock serialized state
            const serializedState = JSON.stringify({
                phase: state_1.GamePhase.PLAYER_TURN,
                players: [],
                turn: 1
            });
            validSession.gameState = serializedState;
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.resolve(validSession));
            // Mock the deserializer to return our mock state
            spyOn(gameStatePreserver, 'deserializeState').and.returnValue(mockState);
            // when
            const result = await gameStatePreserver.getPreservedState(gameId, userId);
            // then
            expect(result).not.toBeNull();
            expect(result.gameId).toBe(gameId);
            expect(result.userId).toBe(userId);
            expect(result.state).toBe(mockState);
        });
        it('should throw GameError when deserialization fails', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const validSession = new disconnected_session_1.DisconnectedSession();
            validSession.gameId = gameId;
            validSession.userId = userId;
            validSession.expiresAt = Date.now() + 300000;
            validSession.gameState = 'invalid-json';
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.resolve(validSession));
            // when & then
            try {
                await gameStatePreserver.getPreservedState(gameId, userId);
                fail('Expected GameError to be thrown');
            }
            catch (error) {
                expect(error instanceof game_error_1.GameError).toBe(true);
            }
        });
    });
    describe('removePreservedState', () => {
        it('should remove session when it exists', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const session = new disconnected_session_1.DisconnectedSession();
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.resolve(session));
            // when
            await gameStatePreserver.removePreservedState(gameId, userId);
            // then
            expect(disconnected_session_1.DisconnectedSession.findOne).toHaveBeenCalledWith({
                where: { userId, gameId }
            });
            expect(session.remove).toHaveBeenCalled();
        });
        it('should handle gracefully when no session exists', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            // when
            await gameStatePreserver.removePreservedState(gameId, userId);
            // then
            expect(disconnected_session_1.DisconnectedSession.findOne).toHaveBeenCalledWith({
                where: { userId, gameId }
            });
            // Should not throw any error
        });
        it('should throw GameError when removal fails', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const session = new disconnected_session_1.DisconnectedSession();
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.resolve(session));
            session.remove.and.returnValue(Promise.reject(new Error('Database error')));
            // when & then
            try {
                await gameStatePreserver.removePreservedState(gameId, userId);
                fail('Expected GameError to be thrown');
            }
            catch (error) {
                expect(error instanceof game_error_1.GameError).toBe(true);
            }
        });
    });
    describe('hasPreservedState', () => {
        it('should return false when no session exists', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            // when
            const result = await gameStatePreserver.hasPreservedState(gameId, userId);
            // then
            expect(result).toBe(false);
        });
        it('should return false and cleanup when session is expired', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const expiredSession = new disconnected_session_1.DisconnectedSession();
            expiredSession.expiresAt = Date.now() - 1000;
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.resolve(expiredSession));
            // when
            const result = await gameStatePreserver.hasPreservedState(gameId, userId);
            // then
            expect(result).toBe(false);
            expect(expiredSession.remove).toHaveBeenCalled();
        });
        it('should return true when valid session exists', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            const validSession = new disconnected_session_1.DisconnectedSession();
            validSession.expiresAt = Date.now() + 300000;
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.resolve(validSession));
            // when
            const result = await gameStatePreserver.hasPreservedState(gameId, userId);
            // then
            expect(result).toBe(true);
        });
        it('should return false when database error occurs', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            disconnected_session_1.DisconnectedSession.findOne.and.returnValue(Promise.reject(new Error('Database error')));
            // when
            const result = await gameStatePreserver.hasPreservedState(gameId, userId);
            // then
            expect(result).toBe(false);
        });
    });
    describe('cleanupExpiredSessions', () => {
        it('should remove expired sessions and return count', async () => {
            // given
            const expiredSession1 = new disconnected_session_1.DisconnectedSession();
            const expiredSession2 = new disconnected_session_1.DisconnectedSession();
            const expiredSessions = [expiredSession1, expiredSession2];
            // Mock the query builder chain
            const mockQueryBuilder = {
                where: jasmine.createSpy('where').and.returnValue({
                    getMany: jasmine.createSpy('getMany').and.returnValue(Promise.resolve(expiredSessions))
                })
            };
            spyOn(disconnected_session_1.DisconnectedSession, 'createQueryBuilder').and.returnValue(mockQueryBuilder);
            // when
            const result = await gameStatePreserver.cleanupExpiredSessions();
            // then
            expect(result).toBe(2);
            expect(expiredSession1.remove).toHaveBeenCalled();
            expect(expiredSession2.remove).toHaveBeenCalled();
        });
        it('should return 0 when no expired sessions exist', async () => {
            // given
            const mockQueryBuilder = {
                where: jasmine.createSpy('where').and.returnValue({
                    getMany: jasmine.createSpy('getMany').and.returnValue(Promise.resolve([]))
                })
            };
            spyOn(disconnected_session_1.DisconnectedSession, 'createQueryBuilder').and.returnValue(mockQueryBuilder);
            // when
            const result = await gameStatePreserver.cleanupExpiredSessions();
            // then
            expect(result).toBe(0);
        });
        it('should return 0 when database error occurs', async () => {
            // given
            const mockQueryBuilder = {
                where: jasmine.createSpy('where').and.returnValue({
                    getMany: jasmine.createSpy('getMany').and.returnValue(Promise.reject(new Error('Database error')))
                })
            };
            spyOn(disconnected_session_1.DisconnectedSession, 'createQueryBuilder').and.returnValue(mockQueryBuilder);
            // when
            const result = await gameStatePreserver.cleanupExpiredSessions();
            // then
            expect(result).toBe(0);
        });
    });
    describe('getPreservedSessionsForUser', () => {
        it('should return sessions for user', async () => {
            // given
            const userId = 456;
            const session1 = new disconnected_session_1.DisconnectedSession();
            const session2 = new disconnected_session_1.DisconnectedSession();
            const sessions = [session1, session2];
            disconnected_session_1.DisconnectedSession.find.and.returnValue(Promise.resolve(sessions));
            // when
            const result = await gameStatePreserver.getPreservedSessionsForUser(userId);
            // then
            expect(result).toBe(sessions);
            expect(disconnected_session_1.DisconnectedSession.find).toHaveBeenCalledWith({
                where: { userId }
            });
        });
        it('should return empty array when database error occurs', async () => {
            // given
            const userId = 456;
            disconnected_session_1.DisconnectedSession.find.and.returnValue(Promise.reject(new Error('Database error')));
            // when
            const result = await gameStatePreserver.getPreservedSessionsForUser(userId);
            // then
            expect(result).toEqual([]);
        });
    });
    describe('serialization error handling', () => {
        it('should handle serialization errors gracefully', async () => {
            // given
            const gameId = 123;
            const userId = 456;
            // Mock the serializer to throw an error
            spyOn(gameStatePreserver, 'serializeState').and.throwError('Serialization failed');
            // when & then
            try {
                await gameStatePreserver.preserveGameState(gameId, userId, mockState);
                fail('Expected GameError to be thrown');
            }
            catch (error) {
                expect(error instanceof game_error_1.GameError).toBe(true);
            }
        });
    });
    describe('configuration', () => {
        it('should use provided configuration values', () => {
            // given
            const customConfig = {
                preservationTimeoutMs: 600000,
                maxPreservedSessionsPerUser: 3,
                maxSerializedStateSize: 1024 * 1024,
                compressionEnabled: true
            };
            // when
            const customPreserver = new game_state_preserver_1.GameStatePreserver(customConfig);
            // then
            expect(customPreserver.config).toEqual(customConfig);
        });
    });
});
