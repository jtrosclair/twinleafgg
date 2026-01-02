import { BaseEntity } from 'typeorm';
export declare class CardArtwork extends BaseEntity {
    id: number;
    name: string;
    cardName: string;
    setCode: string;
    code: string;
    imageUrl: string;
    holoType: string;
}
