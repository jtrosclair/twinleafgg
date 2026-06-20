import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
export declare class GladionsDecisiveBattle extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    readonly GLADION_MARKER = "M5_GLADIONS_DECISIVE_BATTLE";
    reduceEffect(_store: StoreLike, state: State, effect: Effect): State;
}
