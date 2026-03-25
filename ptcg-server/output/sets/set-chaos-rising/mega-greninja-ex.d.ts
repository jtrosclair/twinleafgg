import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
export declare class MegaGreninjaex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.WATER[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly MORTAL_SHURIKEN_MARKER = "MORTAL_SHURIKEN_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
