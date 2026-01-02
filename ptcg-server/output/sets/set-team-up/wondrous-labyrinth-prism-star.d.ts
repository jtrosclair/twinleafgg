import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
export declare class WondrousLabyrinthPrismStar extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    set: string;
    setNumber: string;
    name: string;
    fullName: string;
    cardImage: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
