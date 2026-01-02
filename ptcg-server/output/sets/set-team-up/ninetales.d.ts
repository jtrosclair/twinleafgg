import { PokemonCard, Stage, StoreLike, State } from '../../game';
import { PowerType } from '../../game';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
export declare class Ninetales extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.FIRE;
    hp: number;
    weakness: {
        type: import("../../game").CardType.WATER;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: Attack[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly NINE_TEMPTATIONS_MARKER = "NINE_TEMPTATIONS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
