import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Deino extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    resistance: any[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
