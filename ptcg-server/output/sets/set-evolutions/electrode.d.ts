import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Electrode extends PokemonCard implements EnergyCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    resistance: {
        type: CardType.METAL;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    provides: CardType[];
    energyType: EnergyType;
    text: string;
    isBlocked: boolean;
    blendedEnergies: CardType[];
    blendedEnergyCount: number;
    energyEffect: any;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
