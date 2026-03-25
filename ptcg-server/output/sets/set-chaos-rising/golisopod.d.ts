import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
export declare class Golisopod extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.WATER[];
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
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly INVULN_MARKER = "GOLISOPOD_M4_INVULN_MARKER";
    readonly CLEAR_MARKER = "GOLISOPOD_M4_CLEAR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
