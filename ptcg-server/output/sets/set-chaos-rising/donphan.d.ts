import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
export declare class Donphan extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly NO_REPRIEVE_MARKER = "DONPHAN_M4_NO_REPRIEVE_MARKER";
    readonly NO_REPRIEVE_CLEAR_MARKER = "DONPHAN_M4_NO_REPRIEVE_CLEAR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
