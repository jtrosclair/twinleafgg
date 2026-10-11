import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EnglishPikachuEx54 extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    regulationMark: string;
    set: string;
    setNumber: string;
    usSetNumber: string;
    name: string;
    fullName: string;
    cardImage: string;
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
