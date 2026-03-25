import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class LatiosEx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: CardType.COLORLESS[];
    private readonly PREVENT_EFFECTS_MARKER;
    private readonly CLEAR_PREVENT_EFFECTS_MARKER;
    attacks: ({
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        canUseOnFirstTurn: boolean;
        text: string;
    } | {
        name: string;
        cost: (CardType.WATER | CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
        canUseOnFirstTurn?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
