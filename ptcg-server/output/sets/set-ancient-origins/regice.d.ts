import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export declare class Regice extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly RESISTANCE_BLIZZARD_MARKER = "REGICE_AOR_RESISTANCE_BLIZZARD_MARKER";
    readonly CLEAR_RESISTANCE_BLIZZARD_MARKER = "REGICE_AOR_CLEAR_RESISTANCE_BLIZZARD_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
