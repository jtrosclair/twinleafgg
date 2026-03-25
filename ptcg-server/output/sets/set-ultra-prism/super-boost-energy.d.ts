import { EnergyCard } from '../../game/store/card/energy-card';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class SuperBoostEnergy extends EnergyCard {
    tags: CardTag[];
    provides: CardType[];
    energyType: EnergyType;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
