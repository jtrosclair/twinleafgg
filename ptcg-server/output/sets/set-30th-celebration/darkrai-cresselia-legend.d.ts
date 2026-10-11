import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
declare abstract class DarkraiCresseliaLegend extends PokemonCard {
    abstract half: 'top' | 'bottom';
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    additionalCardTypes: CardType[];
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        text: string;
        exemptFromAbilityLock: boolean;
        useFromHand: boolean;
        powerType: PowerType;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    cardImage: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
export declare class DarkraiCresseliaLegendTopCC16 extends DarkraiCresseliaLegend {
    half: 'top';
    setNumber: string;
    usSetNumber: string;
    fullName: string;
}
export declare class DarkraiCresseliaLegendBottomCC17 extends DarkraiCresseliaLegend {
    half: 'bottom';
    setNumber: string;
    usSetNumber: string;
    fullName: string;
}
export {};
