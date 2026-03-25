import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MSlowbroEx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.WATER[];
        damage: number;
        damageCalculation: "+";
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly LOLL_ROLL_SPIN_MARKER = "M_SLOWBRO_EX_EVO_LOLL_ROLL_SPIN";
    readonly LOLL_ROLL_SPIN_MARKER_2 = "M_SLOWBRO_EX_EVO_LOLL_ROLL_SPIN_2";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
