import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ChaosTower extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    readonly CHAOS_TOWER_CHOICE_MARKER = "CHAOS_TOWER_FCO_CHOICE";
    readonly CHAOS_TOWER_CHOICE_B_MARKER = "CHAOS_TOWER_FCO_CHOICE_B";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private clearBlockedConditions;
}
