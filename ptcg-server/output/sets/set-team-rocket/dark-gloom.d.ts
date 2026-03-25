import { CardTag, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { Attack, PowerType, State, StoreLike } from '../../game';
export declare class DarkGloom extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: import("../../game").CardType.GRASS;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIRE;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: Attack[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly POLLEN_STENCH_MARKER = "POLLEN_STENCH_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
