import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MachampGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
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
        damageCalculation: "+";
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        gxAttack: boolean;
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
