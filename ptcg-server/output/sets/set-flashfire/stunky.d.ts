import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Stunky extends PokemonCard {
    readonly SMOKESCREEN_MARKER = "STUNKY_FLF_SMOKESCREEN_MARKER";
    readonly CLEAR_SMOKESCREEN_MARKER = "STUNKY_FLF_CLEAR_SMOKESCREEN_MARKER";
    readonly SMOKESCREEN_USED_MARKER = "STUNKY_FLF_SMOKESCREEN_USED_MARKER";
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    resistance: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.DARK[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
