import { PokemonCard, Stage, CardType, StoreLike, State, Attack } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Klefki extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.METAL[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    usSetNumber: string;
    name: string;
    fullName: string;
    MEMORY_LOCKED_ATTACK: Attack | undefined;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
