import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Chansey extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly PREVENT_DAMAGE_MARKER = "CHANSEY_EVO_PREVENT_DAMAGE";
    readonly CLEAR_PREVENT_DAMAGE_MARKER = "CHANSEY_EVO_CLEAR_PREVENT_DAMAGE";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
