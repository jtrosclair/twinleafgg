import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Armaldo extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    readonly GUARD_CLAW_MARKER = "ARMALDO_STS_GUARD_CLAW_MARKER";
    readonly CLEAR_GUARD_CLAW_MARKER = "ARMALDO_STS_CLEAR_GUARD_CLAW_MARKER";
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
    usedRushingWater: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
