import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ScizorEx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.METAL[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.METAL[];
        damage: number;
        damageCalculation: "+";
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly STEEL_WING_MARKER = "SCIZOR_EX_STEEL_WING_MARKER";
    readonly CLEAR_STEEL_WING_MARKER = "SCIZOR_EX_CLEAR_STEEL_WING_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
