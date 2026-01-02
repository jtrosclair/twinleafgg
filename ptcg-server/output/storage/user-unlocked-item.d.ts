import { BaseEntity } from 'typeorm';
import { User } from './';
export declare class UserUnlockedItem extends BaseEntity {
    id: number;
    userId: number;
    user: User;
    itemId: string;
    itemType: string;
    created: Date;
}
