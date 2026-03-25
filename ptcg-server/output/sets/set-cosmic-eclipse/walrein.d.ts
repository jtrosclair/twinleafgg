import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Walrein extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    retreat: CardType.COLORLESS[];
    readonly COLD_SNAP_MARKER = "WALREIN_CEC_COLD_SNAP_MARKER";
    readonly CLEAR_COLD_SNAP_MARKER = "WALREIN_CEC_CLEAR_COLD_SNAP_MARKER";
    readonly TRAINER_LOCK_MARKER = "WALREIN_CEC_TRAINER_LOCK_MARKER";
    readonly CLEAR_TRAINER_LOCK_MARKER = "WALREIN_CEC_CLEAR_TRAINER_LOCK_MARKER";
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
