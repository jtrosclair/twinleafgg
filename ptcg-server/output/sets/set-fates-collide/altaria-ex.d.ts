import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class AltariaEx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        damageCalculation: "+";
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly HEALED_MARKER = "ALTARIA_EX_FCO_HEALED_MARKER";
    readonly SHINING_WIND_MARKER = "ALTARIA_EX_FCO_SHINING_WIND_MARKER";
    readonly CLEAR_SHINING_WIND_MARKER = "ALTARIA_EX_FCO_CLEAR_SHINING_WIND_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
