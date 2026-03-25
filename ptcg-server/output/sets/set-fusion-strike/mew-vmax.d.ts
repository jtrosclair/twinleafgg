import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MewVMAX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DARK;
    }[];
    retreat: never[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        copycatAttack: boolean;
        damage: number;
        text: string;
        shredAttack?: undefined;
    } | {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        shredAttack: boolean;
        text: string;
        copycatAttack?: undefined;
    })[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
