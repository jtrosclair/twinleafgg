import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Jumpluff extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: any[];
    attacks: ({
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly LEAF_GUARD_MARKER = "LEAF_GUARD_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
