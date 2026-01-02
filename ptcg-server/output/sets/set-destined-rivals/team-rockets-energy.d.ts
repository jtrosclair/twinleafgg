import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class TeamRocketsEnergy extends EnergyCard {
    provides: CardType[];
    tags: CardTag[];
    energyType: EnergyType;
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    private getExistingEnergy;
    private countEnergyType;
    private getEnergyToProvide;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
