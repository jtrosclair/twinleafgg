import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Elgyem extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly PSYCH_UP_MARKER = "ELGYEM_BKT_PSYCH_UP_MARKER";
    readonly PSYCH_UP_MARKER_2 = "ELGYEM_BKT_PSYCH_UP_MARKER_2";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
