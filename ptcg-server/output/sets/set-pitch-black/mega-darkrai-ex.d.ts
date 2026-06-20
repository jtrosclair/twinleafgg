import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
export declare class MegaDarkraiex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    hp: number;
    cardType: CardType;
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
    } | {
        name: string;
        cost: CardType.DARK[];
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
