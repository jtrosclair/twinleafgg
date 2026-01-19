import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
export declare class Nidoqueen extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.PSYCHIC;
    hp: number;
    weakness: {
        type: import("../../game").CardType.PSYCHIC;
    }[];
    resistance: any[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
