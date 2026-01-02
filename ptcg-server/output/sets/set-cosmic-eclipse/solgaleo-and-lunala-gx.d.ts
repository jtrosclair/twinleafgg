import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class SolgaleoLunalaGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly COSMIC_BURN_MARKER = "COSMIC_BURN_MARKER";
    readonly CLEAR_COSMIC_BURN_MARKER = "CLEAR_COSMIC_BURN_MARKER";
    readonly PLAYED_LILLIES_FULL_FORCE_MARKER = "PLAYED_LILLIES_FULL_FORCE_MARKER";
    readonly LIGHT_OF_THE_PROTECTOR_MARKER = "LIGHT_OF_THE_PROTECTOR_MARKER";
    readonly CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER = "CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
