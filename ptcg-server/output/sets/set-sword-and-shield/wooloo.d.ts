import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Wooloo extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly REDUCE_DAMAGE_MARKER = "WOOLOO_SSH_REDUCE_DAMAGE_MARKER";
    readonly CLEAR_REDUCE_DAMAGE_MARKER = "WOOLOO_SSH_CLEAR_REDUCE_DAMAGE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
