import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Sawk extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    readonly QUICK_GUARD_MARKER = "SAWK_BUS_QUICK_GUARD_MARKER";
    readonly CLEAR_QUICK_GUARD_MARKER = "SAWK_BUS_CLEAR_QUICK_GUARD_MARKER";
    attacks: ({
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    } | {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        shredAttack: boolean;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
