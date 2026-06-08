import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike, State } from '../../game';
export declare class Golbat extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.DARK[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    usSetNumber: string;
    name: string;
    fullName: string;
    readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = "PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER";
    readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = "CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
