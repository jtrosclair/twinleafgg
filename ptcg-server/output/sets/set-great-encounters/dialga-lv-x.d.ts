import { PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class DialgaLVX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    tags: CardTag[];
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: ({
        name: string;
        powerType: PowerType;
        text: string;
        useWhenInPlay?: undefined;
    } | {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    })[];
    attacks: {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly TIME_SKIP_EFFECT_MARKER = "TIME_SKIP_EFFECT_MARKER";
    readonly TIME_SKIP_USED_MARKER = "TIME_SKIP_USED_MARKER";
    readonly METAL_FLASH_USED_MARKER = "METAL_FLASH_USED_MARKER";
    readonly METAL_FLASH_USED_2_MARKER = "METAL_FLASH_USED_2_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
