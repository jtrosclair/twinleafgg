import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class FlygonV extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.GRASS | CardType.FIGHTING)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: (CardType.GRASS | CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: "+";
        text: string;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
