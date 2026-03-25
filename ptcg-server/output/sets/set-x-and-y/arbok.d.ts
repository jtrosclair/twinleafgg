import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export declare class Arbok extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly GASTRO_ACID_MARKER = "GASTRO_ACID_MARKER";
    readonly GASTRO_ACID_TURN1_MARKER = "GASTRO_ACID_TURN1_MARKER";
    readonly CLEAR_GASTRO_ACID_MARKER = "CLEAR_GASTRO_ACID_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
