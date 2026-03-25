import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Skuntank extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    resistance: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
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
    readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "SKUNTANK_DEFENDING_POKEMON_CANNOT_ATTACK_MARKER";
    readonly CLEAR_DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "SKUNTANK_CLEAR_DEFENDING_POKEMON_CANNOT_ATTACK_MARKER";
    readonly SMOGSCREEN_MARKER = "SKUNTANK_SMOGSCREEN_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
