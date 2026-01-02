import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
export declare class ProfessorElm extends TrainerCard {
    trainerType: TrainerType;
    cardImage: string;
    setNumber: string;
    set: string;
    name: string;
    fullName: string;
    text: string;
    readonly PROFESSOR_ELM_MARKER = "PROFESSOR_ELM_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
