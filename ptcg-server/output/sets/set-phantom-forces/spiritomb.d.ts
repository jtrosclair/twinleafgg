import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export declare class Spiritomb extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    readonly BLOCK_EVOLVE_MARKER = "SPIRITOMB_PHF_BLOCK_EVOLVE_MARKER";
    readonly CLEAR_BLOCK_EVOLVE_MARKER = "SPIRITOMB_PHF_CLEAR_BLOCK_EVOLVE_MARKER";
    attacks: {
        name: string;
        cost: (CardType.DARK | CardType.COLORLESS)[];
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
