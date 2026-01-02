import { PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class GardevoirLVX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    tags: CardTag[];
    hp: number;
    weakness: {
        type: CardType.DARK;
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
        cost: CardType.PSYCHIC[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly TELEPORTATION_MARKER = "TELEPORTATION_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
