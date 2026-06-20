import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MegaChandelureex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DARK;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
