import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Yanma extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: any[];
    attacks: ({
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    } | {
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        shredAttack: boolean;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    private usedShockwave;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
