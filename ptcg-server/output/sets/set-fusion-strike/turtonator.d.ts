import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Turtonator extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.FIRE | CardType.FIGHTING)[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly SHELL_TRAP_MARKER = "TURTONATOR_FST_SHELL_TRAP_MARKER";
    readonly CLEAR_SHELL_TRAP_MARKER = "TURTONATOR_FST_CLEAR_SHELL_TRAP_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
