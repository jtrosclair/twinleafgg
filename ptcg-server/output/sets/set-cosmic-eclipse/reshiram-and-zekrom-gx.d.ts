import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ReshiramAndZekromGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: CardType.COLORLESS[];
    readonly NS_RESOLVE_PLAYED_MARKER = "RESHIRAM_ZEKROM_NS_RESOLVE_PLAYED";
    attacks: ({
        name: string;
        cost: (CardType.FIRE | CardType.LIGHTNING)[];
        damage: number;
        damageCalculation: "x";
        text: string;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.LIGHTNING)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
