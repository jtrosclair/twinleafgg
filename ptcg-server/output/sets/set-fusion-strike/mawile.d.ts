import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Mawile extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    retreat: CardType.COLORLESS[];
    readonly CHOMP_HOLD_MARKER = "MAWILE_FST_CHOMP_HOLD_MARKER";
    readonly CLEAR_CHOMP_HOLD_MARKER = "MAWILE_FST_CLEAR_CHOMP_HOLD_MARKER";
    attacks: {
        name: string;
        cost: CardType.PSYCHIC[];
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
