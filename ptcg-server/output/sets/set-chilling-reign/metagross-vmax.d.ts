import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MetagrossVmax extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly NEXT_TURN_MORE_DAMAGE_MARKER = "METAGROSS_VMAX_CRE_NEXT_TURN_DAMAGE_MARKER";
    readonly NEXT_TURN_MORE_DAMAGE_CLEAR_MARKER = "METAGROSS_VMAX_CRE_NEXT_TURN_DAMAGE_CLEAR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
