import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Zoroark extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.DARK[];
        damage: number;
        damageCalculation: string;
        text: string;
        copycatAttack?: undefined;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        copycatAttack: boolean;
        text: string;
        damageCalculation?: undefined;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
