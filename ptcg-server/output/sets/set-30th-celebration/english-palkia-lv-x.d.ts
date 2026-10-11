import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EnglishPalkiaLvXCC12 extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    evolvesFrom: string;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    set: string;
    setNumber: string;
    usSetNumber: string;
    name: string;
    fullName: string;
    cardImage: string;
    readonly RESTRUCTURE_MARKER = "PALKIA_30C_RESTRUCTURE";
    powers: ({
        name: string;
        powerType: PowerType;
        text: string;
        useWhenInPlay?: undefined;
    } | {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    })[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
