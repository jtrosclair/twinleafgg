import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class DarkBell extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
