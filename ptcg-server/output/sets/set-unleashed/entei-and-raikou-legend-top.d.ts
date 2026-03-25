import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EnteiAndRaikouLegendTop extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType.FIRE;
    additionalCardTypes: CardType.LIGHTNING[];
    hp: number;
    weakness: ({
        type: CardType.WATER;
    } | {
        type: CardType.FIGHTING;
    })[];
    retreat: any[];
    powers: {
        name: string;
        text: string;
        exemptFromAbilityLock: boolean;
        useFromHand: boolean;
        powerType: PowerType;
    }[];
    attacks: ({
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: (CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
