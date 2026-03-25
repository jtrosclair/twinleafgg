import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Marill extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    resistance: any[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly PREVENT_DAMAGE_MARKER = "PREVENT_DAMAGE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
