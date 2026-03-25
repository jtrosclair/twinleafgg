import { Card } from '../../game/store/card/card';
import { State } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { Prompt } from '../../game/store/prompts/prompt';
export interface PokemonSlotConfig {
    card: string;
    energy?: string[];
    damage?: number;
    tools?: string[];
}
export interface PlayerConfig {
    active: PokemonSlotConfig;
    bench?: PokemonSlotConfig[];
    hand?: string[];
    deck?: string[];
    discard?: string[];
    prizeCount?: number;
}
export interface SetupGameConfig {
    player1: PlayerConfig;
    player2: PlayerConfig;
    /** Override the starting turn number (default 1) */
    turn?: number;
}
export declare function ensureCardsRegistered(cardNames?: string[]): void;
export declare function getCardByName(fullName: string): Card;
export declare function padDeck(n: number, cardName?: string): string[];
type PromptHandler = (prompt: Prompt<any>, state: State) => any;
export interface SetupGameResult {
    store: Store;
    state: State;
    player1: Player;
    player2: Player;
    overridePrompt: (type: string, handler: PromptHandler) => void;
}
export declare function setupGame(config: SetupGameConfig): SetupGameResult;
export {};
