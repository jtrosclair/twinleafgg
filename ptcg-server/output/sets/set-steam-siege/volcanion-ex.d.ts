import { PokemonCard, Stage, PowerType, CardType, State, StoreLike, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class VolcanionEX extends PokemonCard {
    cardType: CardType.FIRE;
    additionalCardTypes: CardType.WATER[];
    tags: CardTag[];
    stage: Stage;
    hp: number;
    weakness: {
        type: CardType.WATER;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly STEAM_UP_MARKER = "STEAM_UP_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
