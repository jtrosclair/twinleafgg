import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class LatiasAndLatiosGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: CardType.COLORLESS[];
    readonly AERO_UNIT_MARKER = "LATIAS_LATIOS_GX_AERO_UNIT_MARKER";
    readonly CLEAR_AERO_UNIT_MARKER = "LATIAS_LATIOS_GX_CLEAR_AERO_UNIT_MARKER";
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.PSYCHIC | CardType.COLORLESS)[];
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
