import { BaseEntity } from 'typeorm';
import { User } from './user';
export declare enum FriendStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    BLOCKED = "blocked"
}
export declare class Friend extends BaseEntity {
    id: number;
    user_id: number;
    user: User;
    friend_id: number;
    friend: User;
    status: FriendStatus;
    created_at: Date;
    updated_at: Date;
    static findFriendship(userId: number, friendId: number): Promise<Friend | null>;
    static getFriendsList(userId: number): Promise<Friend[]>;
    static getPendingRequests(userId: number): Promise<Friend[]>;
    static getSentRequests(userId: number): Promise<Friend[]>;
}
