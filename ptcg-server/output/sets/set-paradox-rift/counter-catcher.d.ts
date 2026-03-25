import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Player } from '../../game';
export declare class CounterCatcher extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    text: string;
    readonly COUNTER_CATCHER_MARKER = "COUNTER_CATCHER_MARKER";
    canPlay(store: StoreLike, state: State, player: Player): boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
