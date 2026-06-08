import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Trevenant extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DARK;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        damageCalculation: "+";
        text: string;
    })[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    usSetNumber: string;
    name: string;
    fullName: string;
    readonly CURSED_ROOTS_MARKER = "CURSED_ROOTS_MARKER";
    readonly CLEAR_CURSED_ROOTS_MARKER = "CLEAR_CURSED_ROOTS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
