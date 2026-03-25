import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Crobat extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    additionalCardTypes: CardType.METAL[];
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: never[];
    attacks: {
        name: string;
        cost: (CardType.GRASS | CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER = "OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
