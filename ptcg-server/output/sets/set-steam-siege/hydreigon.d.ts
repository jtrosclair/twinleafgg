import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Hydreigon extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: CardType.COLORLESS[];
    readonly CRUEL_FANG_MARKER = "HYDREIGON_STS_CRUEL_FANG_MARKER";
    readonly CLEAR_CRUEL_FANG_MARKER = "HYDREIGON_STS_CLEAR_CRUEL_FANG_MARKER";
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: (CardType.PSYCHIC | CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: "x";
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
