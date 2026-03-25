import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Latias extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.FIRE | CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly RED_ASSIST_MARKER = "LATIAS_FST_RED_ASSIST_MARKER";
    readonly DYNA_BARRIER_MARKER = "LATIAS_FST_DYNA_BARRIER_MARKER";
    readonly CLEAR_DYNA_BARRIER_MARKER = "LATIAS_FST_CLEAR_DYNA_BARRIER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
