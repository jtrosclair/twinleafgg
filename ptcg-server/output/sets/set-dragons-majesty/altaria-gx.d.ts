import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class AltariaGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS | CardType.FAIRY)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly BRIGHT_TONE_MARKER = "BRIGHT_TONE_MARKER";
    readonly CLEAR_BRIGHT_TONE_MARKER = "CLEAR_BRIGHT_TONE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
