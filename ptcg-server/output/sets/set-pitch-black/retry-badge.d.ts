import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class RetryBadge extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(_store: StoreLike, state: State, _effect: Effect): State;
}
