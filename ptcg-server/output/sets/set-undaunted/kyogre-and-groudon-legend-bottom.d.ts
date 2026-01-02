import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class KyogreAndGroudonLegendBottom extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: import("../../game").CardType.WATER;
    additionalCardTypes: import("../../game").CardType.FIGHTING[];
    hp: number;
    weakness: ({
        type: import("../../game").CardType.GRASS;
    } | {
        type: import("../../game").CardType.LIGHTNING;
    })[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        text: string;
        exemptFromAbilityLock: boolean;
        useFromHand: boolean;
        powerType: PowerType;
    }[];
    attacks: ({
        name: string;
        cost: (import("../../game").CardType.WATER | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: (import("../../game").CardType.FIGHTING | import("../../game").CardType.COLORLESS)[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
