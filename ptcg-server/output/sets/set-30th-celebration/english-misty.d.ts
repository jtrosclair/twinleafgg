import { TrainerCard, TrainerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EnglishMistyCC3 extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    usSetNumber: string;
    name: string;
    fullName: string;
    cardImage: string;
    readonly MISTY_MARKER = "MISTY_30C_DAMAGE";
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
