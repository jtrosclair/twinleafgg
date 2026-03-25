import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HisuianSliggoo extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    readonly REDUCE_DAMAGE_MARKER = "HISUIAN_SLIGGOO_LOR_REDUCE_DAMAGE_MARKER";
    readonly CLEAR_REDUCE_DAMAGE_MARKER = "HISUIAN_SLIGGOO_LOR_CLEAR_REDUCE_DAMAGE_MARKER";
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.METAL)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
