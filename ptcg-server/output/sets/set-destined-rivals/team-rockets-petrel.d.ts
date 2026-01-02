import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
export declare class TeamRocketsPetrel extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
