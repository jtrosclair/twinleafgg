import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Scizor extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.METAL[];
        damage: number;
        damageCalculation: "+";
        text: string;
    } | {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly GUARD_CLAW_MARKER = "SCIZOR_RCL_GUARD_CLAW_MARKER";
    readonly CLEAR_GUARD_CLAW_MARKER = "SCIZOR_RCL_CLEAR_GUARD_CLAW_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
