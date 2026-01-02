import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Sableye extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    resistance: {
        type: CardType.COLORLESS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.DARK[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly NIGHT_VISION_MARKER = "NIGHT_VISION_MARKER";
    readonly OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER = "OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
