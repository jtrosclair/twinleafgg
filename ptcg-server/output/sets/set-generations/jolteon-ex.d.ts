import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class JolteonEX extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    resistance: {
        type: CardType.METAL;
        value: number;
    }[];
    retreat: never[];
    attacks: ({
        name: string;
        cost: CardType.LIGHTNING[];
        damage: number;
        shredAttack: boolean;
        text: string;
    } | {
        name: string;
        cost: (CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly FLASH_RAY_MARKER = "FLASH_RAY_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
