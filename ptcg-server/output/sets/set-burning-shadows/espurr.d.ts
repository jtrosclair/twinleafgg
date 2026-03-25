import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Espurr extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    readonly PERPLEXING_EYES_MARKER = "ESPURR_BUS_PERPLEXING_EYES_MARKER";
    readonly PERPLEXING_EYES_2_MARKER = "ESPURR_BUS_PERPLEXING_EYES_2_MARKER";
    readonly CLEAR_PERPLEXING_EYES_MARKER = "ESPURR_BUS_CLEAR_PERPLEXING_EYES_MARKER";
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
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
