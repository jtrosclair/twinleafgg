import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
/** Bolty Lightning Energy — set M5 card #80. */
export declare class BoltyLightningEnergy extends EnergyCard {
    provides: CardType[];
    energyType: EnergyType;
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
