import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Tangrowth extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.GRASS;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIRE;
    }[];
    resistance: any[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.GRASS | import("../../game").CardType.COLORLESS)[];
        damage: number;
        damageCalculation: string;
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
