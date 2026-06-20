import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MegaZeraoraex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.LIGHTNING[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: CardType.LIGHTNING[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
