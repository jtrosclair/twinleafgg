import { StoreLike, State, Player } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
export declare class CampingGear extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    regulationMark: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    canPlay(store: StoreLike, state: State, player: Player): boolean;
}
