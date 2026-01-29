import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class LatiosGX extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: any[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly TAG_PURGE_MARKER = "TAG_PURGE_MARKER";
    readonly CLEAR_TAG_PURGE_MARKER = "CLEAR_TAG_PURGE_MARKER";
    readonly CLEAR_VISION_GX_MARKER = "CLEAR_VISION_GX_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
