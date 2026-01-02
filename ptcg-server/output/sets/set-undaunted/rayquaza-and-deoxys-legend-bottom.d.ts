import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class RayquazaAndDeoxysLegendBottom extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: import("../../game").CardType.COLORLESS;
    additionalCardTypes: import("../../game").CardType.PSYCHIC[];
    hp: number;
    weakness: ({
        type: import("../../game").CardType.COLORLESS;
    } | {
        type: import("../../game").CardType.PSYCHIC;
    })[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: ({
        name: string;
        text: string;
        exemptFromAbilityLock: boolean;
        useFromHand: boolean;
        powerType: PowerType;
    } | {
        name: string;
        powerType: PowerType;
        text: string;
        exemptFromAbilityLock?: undefined;
        useFromHand?: undefined;
    })[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.FIRE | import("../../game").CardType.LIGHTNING | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
