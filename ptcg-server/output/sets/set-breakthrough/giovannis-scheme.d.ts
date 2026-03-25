import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class GiovannisScheme extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    private readonly GIOVANNIS_SCHEME_MARKER;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
