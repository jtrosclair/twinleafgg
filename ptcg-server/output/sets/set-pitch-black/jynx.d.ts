import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Jynx extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DARK;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly WICKED_MARKER = "M5_JYNX_WICKED";
    readonly CLEAR_WICKED_MARKER = "M5_JYNX_CLEAR_WICKED";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
