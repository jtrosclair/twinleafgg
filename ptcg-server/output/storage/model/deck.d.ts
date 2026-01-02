import { BaseEntity } from 'typeorm';
import { User } from './user';
export declare class Deck extends BaseEntity {
    id: number;
    user: User;
    name: string;
    cards: string;
    isValid: boolean;
    cardTypes: string;
    manualArchetype1: string;
    manualArchetype2: string;
    artworks?: string;
}
