import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class GolisopodGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    readonly ARMOR_PRESS_MARKER = "GOLISOPOD_GX_BUS_ARMOR_PRESS_MARKER";
    readonly CLEAR_ARMOR_PRESS_MARKER = "GOLISOPOD_GX_BUS_CLEAR_ARMOR_PRESS_MARKER";
    usedCrossingCutGx: boolean;
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
