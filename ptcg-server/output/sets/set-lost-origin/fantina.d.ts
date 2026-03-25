import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Fantina extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    readonly FANTINA_MARKER = "FANTINA_LOR_MARKER";
    readonly CLEAR_FANTINA_MARKER = "FANTINA_LOR_CLEAR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
