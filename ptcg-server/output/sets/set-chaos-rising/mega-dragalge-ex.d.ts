import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
export declare class MegaDragalgeex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: (CardType.WATER | CardType.DARK)[];
        damage: number;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
