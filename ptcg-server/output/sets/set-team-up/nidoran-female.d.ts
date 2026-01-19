import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class NidoranFemale extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.PSYCHIC;
    hp: number;
    weakness: {
        type: import("../../game").CardType.PSYCHIC;
    }[];
    resistance: any[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
