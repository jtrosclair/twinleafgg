import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Miraidonex extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.LIGHTNING | CardType.PSYCHIC)[];
        damage: number;
        damageCalculator: string;
        text: string;
    } | {
        name: string;
        cost: (CardType.LIGHTNING | CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculator?: undefined;
    })[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
