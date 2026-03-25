import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class TurtonatorGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.WATER;
    }[];
    retreat: CardType.COLORLESS[];
    readonly SHELL_TRAP_MARKER = "TURTONATOR_GX_SHELL_TRAP_MARKER";
    readonly CLEAR_SHELL_TRAP_MARKER = "TURTONATOR_GX_CLEAR_SHELL_TRAP_MARKER";
    attacks: {
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
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
