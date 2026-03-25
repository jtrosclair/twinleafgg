import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Spiritomb extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.DARK[];
        damage: number;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly TICKING_TERROR_MARKER = "SPIRITOMB_BRS_TICKING_TERROR_MARKER";
    readonly TICKING_TERROR_2_MARKER = "SPIRITOMB_BRS_TICKING_TERROR_2_MARKER";
    readonly CLEAR_TICKING_TERROR_MARKER = "SPIRITOMB_BRS_CLEAR_TICKING_TERROR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
