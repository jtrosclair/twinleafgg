import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, Attack } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Bouffalant extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: Attack[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly READY_TO_RAM_MARKER = "BOUFFALANT_SSP_READY_TO_RAM_MARKER";
    readonly CLEAR_READY_TO_RAM_MARKER = "BOUFFALANT_SSP_CLEAR_READY_TO_RAM_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
