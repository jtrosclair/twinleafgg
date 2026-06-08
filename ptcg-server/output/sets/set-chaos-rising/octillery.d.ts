import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
export declare class Octillery extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
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
    readonly CORNER_STOP_MARKER = "OCTILLERY_M4_CORNER_STOP_MARKER";
    readonly CLEAR_MARKER = "OCTILLERY_M4_CLEAR_MARKER";
    readonly USED_MARKER = "OCTILLERY_M4_USED_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
