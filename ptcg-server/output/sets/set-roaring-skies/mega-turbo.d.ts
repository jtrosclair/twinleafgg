import { TrainerCard, TrainerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MegaTurbo extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    name: string;
    cardImage: string;
    setNumber: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
