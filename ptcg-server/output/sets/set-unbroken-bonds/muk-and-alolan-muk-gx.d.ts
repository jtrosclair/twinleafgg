import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MukAlolanMukGX extends PokemonCard {
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
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: any[];
        damage: number;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
