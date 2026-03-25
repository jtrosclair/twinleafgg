import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Gible2 extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DRAGON;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: "+";
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "GIBLE2_DEFENDING_CANNOT_ATTACK_MARKER";
    readonly SAND_ATTACK_MARKER = "GIBLE2_SAND_ATTACK_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
