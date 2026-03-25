import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Victreebel extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    readonly GASTRO_ACID_MARKER = "VICTREEBEL_UNB_GASTRO_ACID";
    readonly CLEAR_GASTRO_ACID_MARKER = "VICTREEBEL_UNB_CLEAR_GASTRO_ACID";
    readonly GASTRO_ACID_2_MARKER = "VICTREEBEL_UNB_GASTRO_ACID_2";
    attacks: ({
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        damageCalculation: "+";
        text: string;
    } | {
        name: string;
        cost: (CardType.GRASS | CardType.COLORLESS)[];
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
