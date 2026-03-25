import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Talonflame extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    readonly TAKE_MORE_DAMAGE_MARKER = "TALONFLAME_TAKE_MORE_DAMAGE_MARKER";
    readonly CLEAR_TAKE_MORE_DAMAGE_MARKER = "TALONFLAME_CLEAR_TAKE_MORE_DAMAGE_MARKER";
    attacks: ({
        name: string;
        cost: CardType.FIRE[];
        damage: number;
        damageCalculation: "+";
        text: string;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
