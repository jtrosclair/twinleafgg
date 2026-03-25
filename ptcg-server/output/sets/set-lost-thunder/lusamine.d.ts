import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Lusamine extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    readonly PREVENT_DAMAGE_MARKER = "LUSAMINE_PRISM_PREVENT_DAMAGE";
    readonly CLEAR_PREVENT_DAMAGE_MARKER = "LUSAMINE_PRISM_CLEAR_PREVENT_DAMAGE";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
