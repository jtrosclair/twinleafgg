import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HisuianGrowlithe extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly PREVENT_DAMAGE_MARKER = "HISUIAN_GROWLITHE_ASR_PREVENT_DAMAGE";
    readonly CLEAR_PREVENT_DAMAGE_MARKER = "HISUIAN_GROWLITHE_ASR_CLEAR_PREVENT_DAMAGE";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
