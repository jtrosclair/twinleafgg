import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Bagon extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: CardType.COLORLESS[];
    readonly ROCK_HEAD_MARKER = "BAGON_CES_ROCK_HEAD_MARKER";
    readonly CLEAR_ROCK_HEAD_MARKER = "BAGON_CES_CLEAR_ROCK_HEAD_MARKER";
    attacks: {
        name: string;
        cost: CardType.WATER[];
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
