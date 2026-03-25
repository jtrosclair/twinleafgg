import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Froslass extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    retreat: CardType.COLORLESS[];
    readonly CANDICE_MARKER = "FROSLASS_SIT_CANDICE_MARKER";
    attacks: ({
        name: string;
        cost: CardType.WATER[];
        damage: number;
        damageCalculation: "+";
        text: string;
    } | {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
