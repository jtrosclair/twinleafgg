import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class AlolanSandslash extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    retreat: CardType.COLORLESS[];
    readonly SPIKE_ARMOR_MARKER = "ALOLAN_SANDSLASH_UPR_SPIKE_ARMOR_MARKER";
    readonly CLEAR_SPIKE_ARMOR_MARKER = "ALOLAN_SANDSLASH_UPR_CLEAR_SPIKE_ARMOR_MARKER";
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
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
