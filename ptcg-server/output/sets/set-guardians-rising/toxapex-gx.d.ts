import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ToxapexGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    readonly TOTAL_SHELTER_MARKER = "TOXAPEX_GX_TOTAL_SHELTER_MARKER";
    readonly CLEAR_TOTAL_SHELTER_MARKER = "TOXAPEX_GX_CLEAR_TOTAL_SHELTER_MARKER";
    attacks: ({
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        damageCalculation: "x";
        text: string;
    } | {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
