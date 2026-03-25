import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class UltraForestKartenvoy extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    readonly KARTENVOY_MARKER = "ULTRA_FOREST_KARTENVOY_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
