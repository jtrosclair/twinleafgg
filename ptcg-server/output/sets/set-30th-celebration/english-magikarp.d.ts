import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EnglishMagikarpCC30 extends PokemonCard {
    stage: Stage;
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
        damageCalculation: string;
        text: string;
    }[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
