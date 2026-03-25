import { PokemonCard, PowerType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Froslass extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    weakness: {
        type: CardType.METAL;
    }[];
    hp: number;
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    CHILLING_CURTAIN_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
