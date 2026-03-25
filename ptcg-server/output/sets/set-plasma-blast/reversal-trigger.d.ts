import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ReversalTrigger extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    damageDealt: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
