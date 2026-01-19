import { PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class FloatzelGLLVX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    tags: CardTag[];
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: any[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.WATER[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly WATER_RESCUE_MARKER = "WATER_RESCUE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
