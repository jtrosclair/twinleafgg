import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, Player } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class FightingAuLait extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    canPlay(store: StoreLike, state: State, player: Player): boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
