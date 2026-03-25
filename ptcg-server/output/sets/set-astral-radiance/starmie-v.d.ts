import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
export declare class StarmieV extends PokemonCard {
    tags: CardTag[];
    regulationMark: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: any[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        shredAttack: boolean;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.WATER[];
        damage: number;
        damageCalculation: string;
        text: string;
        shredAttack?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
