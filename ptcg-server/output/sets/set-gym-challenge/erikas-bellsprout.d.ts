import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ErikasBellsprout extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    tags: CardTag[];
    hp: number;
    weakness: {
        type: CardType.FIRE;
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
        cost: CardType.GRASS[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    ABILITY_USED_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
