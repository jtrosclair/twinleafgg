import { BaseEntity } from 'typeorm';
import { User } from './user';
export declare class DisconnectedSession extends BaseEntity {
    id: number;
    userId: number;
    gameId: number;
    gameState: string;
    disconnectedAt: number;
    expiresAt: number;
    gamePhase: string;
    isPlayerTurn: boolean;
    disconnectionReason?: string;
    user: User;
}
