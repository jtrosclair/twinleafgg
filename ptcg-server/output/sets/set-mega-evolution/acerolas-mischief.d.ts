import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
export declare class AcerolasMischief extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    text: string;
    canPlay(store: StoreLike, state: State, player: Player): boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
