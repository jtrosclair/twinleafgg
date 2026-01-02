import { BaseEntity } from 'typeorm';
import { User } from './user';
import { GameWinner } from '../../game';
export declare class Match extends BaseEntity {
    id: number;
    player1: User;
    player2: User;
    ranking1: number;
    rankingStake1: number;
    ranking2: number;
    rankingStake2: number;
    winner: GameWinner;
    created: number;
    replayData: string;
    player1Archetype: string;
    player1Archetype2: string;
    player2Archetype: string;
    player2Archetype2: string;
    player1DeckName: string;
    player2DeckName: string;
    player1DeckId: number | null;
    player2DeckId: number | null;
}
