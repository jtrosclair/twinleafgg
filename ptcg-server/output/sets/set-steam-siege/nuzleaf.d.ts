import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Nuzleaf extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    readonly HARDEN_MARKER = "NUZLEAF_STS_HARDEN_MARKER";
    readonly CLEAR_HARDEN_MARKER = "NUZLEAF_STS_CLEAR_HARDEN_MARKER";
    attacks: ({
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
