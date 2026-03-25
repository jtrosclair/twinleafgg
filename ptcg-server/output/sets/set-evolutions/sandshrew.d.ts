import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Sandshrew extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    readonly SAND_ATTACK_MARKER = "SANDSHREW_EVO_SAND_ATTACK_MARKER";
    readonly CLEAR_SAND_ATTACK_MARKER = "SANDSHREW_EVO_CLEAR_SAND_ATTACK_MARKER";
    readonly SAND_ATTACK_USED_MARKER = "SANDSHREW_EVO_SAND_ATTACK_USED_MARKER";
    attacks: {
        name: string;
        cost: CardType.FIGHTING[];
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
