import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EnteiAndRaikouLegendBottom extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: import("../../game").CardType.FIRE;
    additionalCardTypes: import("../../game").CardType.LIGHTNING[];
    hp: number;
    weakness: ({
        type: import("../../game").CardType.WATER;
    } | {
        type: import("../../game").CardType.FIGHTING;
    })[];
    retreat: never[];
    powers: {
        name: string;
        text: string;
        exemptFromAbilityLock: boolean;
        useFromHand: boolean;
        powerType: PowerType;
    }[];
    attacks: ({
        name: string;
        cost: (import("../../game").CardType.FIRE | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: (import("../../game").CardType.LIGHTNING | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
