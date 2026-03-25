import { CardTag, CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HeatranGX extends PokemonCard {
    cardType: CardType.FIRE;
    tags: CardTag[];
    hp: number;
    stage: Stage;
    weakness: {
        type: CardType.WATER;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.FIRE[];
        damage: number;
        damageCalculation: string;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    ABILITY_USED_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
