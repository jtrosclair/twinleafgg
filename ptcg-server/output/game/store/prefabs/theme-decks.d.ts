import { Format, Archetype } from '../card/card-types';
export declare const THEME_DECKS: ({
    id: number;
    name: string;
    cards: string[];
    format: Format[];
    isValid: boolean;
    cardTypes: string;
    manualArchetype1: Archetype;
    manualArchetype2: Archetype;
} | {
    id: number;
    name: string;
    cards: string[];
    format: Format[];
    isValid: boolean;
    cardTypes: string;
    manualArchetype1: Archetype;
    manualArchetype2?: undefined;
})[];
