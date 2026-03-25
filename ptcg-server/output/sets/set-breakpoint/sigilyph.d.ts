import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Sigilyph extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly REFLECTIVE_SHIELD_MARKER = "SIGILYPH_BKP_REFLECTIVE_SHIELD_MARKER";
    readonly CLEAR_REFLECTIVE_SHIELD_MARKER = "SIGILYPH_BKP_CLEAR_REFLECTIVE_SHIELD_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
