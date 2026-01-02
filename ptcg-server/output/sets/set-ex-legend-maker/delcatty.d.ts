import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, PowerType } from '../../game';
export declare class Delcatty extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    hp: number;
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly REACTIVE_SHIFT_MARKER = "REACTIVE_SHIFT_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
