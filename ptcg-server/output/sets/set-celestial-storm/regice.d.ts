import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Regice extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistance: any[];
    retreat: CardType[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly OPPONENT_CANNOT_PLAY_STADIUMS_MARKER = "OPPONENT_CANNOT_PLAY_STADIUMS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
