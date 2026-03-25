import { Attack } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class RapidStrikeScrollOfTheSkies extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
