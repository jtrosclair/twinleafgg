import { BaseEntity } from 'typeorm';
import { User } from './user';
export declare class UserFavoriteCard extends BaseEntity {
    id: number;
    user: User;
    userId: number;
    cardName: string;
    fullName: string;
}
