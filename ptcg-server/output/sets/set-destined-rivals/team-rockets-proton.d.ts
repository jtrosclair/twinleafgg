import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
export declare class TeamRocketsProton extends TrainerCard {
    regulationMark: string;
    tags: CardTag[];
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    firstTurn: boolean;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
