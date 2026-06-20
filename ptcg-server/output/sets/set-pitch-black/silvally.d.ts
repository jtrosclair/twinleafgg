import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
export declare class Silvally extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly BUDDY_MARKER = "M5_SILVALLY_BUDDY";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
