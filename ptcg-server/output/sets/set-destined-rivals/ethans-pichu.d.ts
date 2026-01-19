import { PokemonCard, Stage, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EthansPichu extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: import("../../game").CardType.LIGHTNING;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIGHTING;
    }[];
    retreat: any[];
    attacks: {
        name: string;
        cost: any[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
