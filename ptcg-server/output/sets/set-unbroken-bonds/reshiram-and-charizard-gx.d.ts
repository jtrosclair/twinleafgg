import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ReshiramCharizardGX extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.WATER;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: string;
        text: string;
        shredAttack?: undefined;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
        shredAttack?: undefined;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.FIRE[];
        damage: number;
        shredAttack: boolean;
        gxAttack: boolean;
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
