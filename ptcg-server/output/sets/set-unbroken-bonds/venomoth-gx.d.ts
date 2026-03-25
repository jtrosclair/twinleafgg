import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class VenomothGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.GRASS | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: "+";
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly KOGAS_TRAP_MARKER = "VENOMOTH_GX_KOGAS_TRAP_MARKER";
    readonly JANINE_MARKER = "VENOMOTH_GX_JANINE_MARKER";
    readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = "VENOMOTH_GX_PREVENT_DAMAGE_FROM_BASIC_MARKER";
    readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = "VENOMOTH_GX_CLEAR_PREVENT_DAMAGE_FROM_BASIC_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
