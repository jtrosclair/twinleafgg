import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
export declare class MegaExcadrillex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.METAL[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.METAL[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
