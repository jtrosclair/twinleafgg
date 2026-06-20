import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
export declare class HeroicBomb extends TrainerCard {
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
