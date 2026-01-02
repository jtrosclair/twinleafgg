import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Rayquaza extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    additionalCardTypes: CardType.METAL[];
    hp: number;
    weakness: {
        type: CardType.COLORLESS;
    }[];
    resistance: ({
        type: CardType.WATER;
        value: number;
    } | {
        type: CardType.FIGHTING;
        value: number;
    })[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: CardType.LIGHTNING[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (CardType.LIGHTNING | CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
