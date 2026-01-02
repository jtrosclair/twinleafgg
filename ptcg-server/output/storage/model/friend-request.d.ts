import { BaseEntity } from 'typeorm';
import { User } from './user';
export declare enum FriendRequestStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}
export declare class FriendRequest extends BaseEntity {
    id: number;
    sender_id: number;
    sender: User;
    receiver_id: number;
    receiver: User;
    status: FriendRequestStatus;
    created_at: Date;
    updated_at: Date;
    static findRequest(senderId: number, receiverId: number): Promise<FriendRequest | null>;
    static getPendingRequests(userId: number): Promise<FriendRequest[]>;
    static getSentRequests(userId: number): Promise<FriendRequest[]>;
}
