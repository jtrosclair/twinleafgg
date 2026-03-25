import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Cottonee extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    resistance: {
        type: CardType.DARK;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    readonly REDUCE_DAMAGE_MARKER = "COTTONEE_REDUCE_DAMAGE";
    readonly CLEAR_REDUCE_DAMAGE_MARKER = "COTTONEE_CLEAR_REDUCE_DAMAGE";
    attacks: {
        name: string;
        cost: CardType.FAIRY[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
