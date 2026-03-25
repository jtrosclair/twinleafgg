import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Hippopotas extends PokemonCard {
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
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly SAND_ATTACK_MARKER = "HIPPOPOTAS_BKT_SAND_ATTACK_MARKER";
    readonly CLEAR_SAND_ATTACK_MARKER = "HIPPOPOTAS_BKT_CLEAR_SAND_ATTACK_MARKER";
    readonly SAND_ATTACK_USED_MARKER = "HIPPOPOTAS_BKT_SAND_ATTACK_USED_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
