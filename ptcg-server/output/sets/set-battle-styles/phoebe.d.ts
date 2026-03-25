import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Phoebe extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    readonly PHOEBE_MARKER = "PHOEBE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
