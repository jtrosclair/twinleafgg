import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HolonsMagneton extends PokemonCard implements EnergyCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useFromHand: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
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
