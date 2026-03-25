import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export declare class FlyingPikachu extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.LIGHTNING[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly PREVENT_ALL_MARKER = "FLYING_PIKACHU_EVO_PREVENT_ALL";
    readonly CLEAR_PREVENT_ALL_MARKER = "FLYING_PIKACHU_EVO_CLEAR_PREVENT_ALL";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
