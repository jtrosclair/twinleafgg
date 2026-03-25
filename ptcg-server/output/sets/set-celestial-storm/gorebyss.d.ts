import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Gorebyss extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: never[];
    readonly DEFLECTING_SPLASH_MARKER = "GOREBYSS_CES_DEFLECTING_SPLASH_MARKER";
    readonly CLEAR_DEFLECTING_SPLASH_MARKER = "GOREBYSS_CES_CLEAR_DEFLECTING_SPLASH_MARKER";
    attacks: {
        name: string;
        cost: CardType.WATER[];
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
