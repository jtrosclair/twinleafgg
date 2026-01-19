import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Garchomp extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: any[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    private readonly CYNTHIA_MARKER;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
