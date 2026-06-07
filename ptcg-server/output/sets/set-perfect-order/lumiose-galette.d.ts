import { TrainerCard, TrainerType, StoreLike, State, Player } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class LumioseGalette extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    usSetNumber: string;
    name: string;
    fullName: string;
    text: string;
    canPlay(store: StoreLike, state: State, player: Player): boolean | undefined;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
