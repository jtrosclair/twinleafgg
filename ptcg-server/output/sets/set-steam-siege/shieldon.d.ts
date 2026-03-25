import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Shieldon extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly REDUCE_DAMAGE_MARKER = "SHIELDON_STS_REDUCE_DAMAGE";
    readonly CLEAR_REDUCE_DAMAGE_MARKER = "SHIELDON_STS_CLEAR_REDUCE_DAMAGE";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
