import { PokemonCard, CardTag, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/game-effects';
export declare class BuzzwoleGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
