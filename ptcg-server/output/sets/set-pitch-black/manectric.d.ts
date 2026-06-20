import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Manectric extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    readonly FLASH_BARRIER_MARKER = "M5_MANECTRIC_FLASH_BARRIER";
    readonly CLEAR_FLASH_BARRIER_MARKER = "M5_MANECTRIC_CLEAR_FLASH";
    attacks: ({
        name: string;
        cost: CardType.LIGHTNING[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    } | {
        name: string;
        cost: CardType.LIGHTNING[];
        damage: number;
        shredAttack: boolean;
        text: string;
    })[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
