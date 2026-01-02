import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class RayquazaAndDeoxysLegendTop extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType.COLORLESS;
    additionalCardTypes: CardType.PSYCHIC[];
    hp: number;
    weakness: ({
        type: CardType.COLORLESS;
    } | {
        type: CardType.PSYCHIC;
    })[];
    retreat: CardType.COLORLESS[];
    powers: ({
        name: string;
        text: string;
        exemptFromAbilityLock: boolean;
        useFromHand: boolean;
        powerType: PowerType;
    } | {
        name: string;
        powerType: PowerType;
        text: string;
        exemptFromAbilityLock?: undefined;
        useFromHand?: undefined;
    })[];
    attacks: {
        name: string;
        cost: (CardType.FIRE | CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
