import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Hydreigonex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: import("../../game").CardType.DARK;
    hp: number;
    weakness: {
        type: import("../../game").CardType.GRASS;
    }[];
    resistance: any[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.DARK | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
