import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Sylveon extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    resistance: {
        type: CardType.DARK;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    readonly REDUCE_DAMAGE_MARKER = "SYLVEON_CEC_REDUCE_DAMAGE_MARKER";
    readonly CLEAR_REDUCE_DAMAGE_MARKER = "SYLVEON_CEC_CLEAR_REDUCE_DAMAGE_MARKER";
    readonly TAG_TEAM_SUPPORTER_PLAYED_MARKER = "SYLVEON_CEC_TAG_TEAM_SUPPORTER_PLAYED";
    attacks: ({
        name: string;
        cost: CardType.FAIRY[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: (CardType.COLORLESS | CardType.FAIRY)[];
        damage: number;
        damageCalculation: "+";
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
