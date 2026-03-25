import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { Attack, State, StoreLike, Weakness } from '../../game';
export declare class Poliwrath extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    retreat: CardType[];
    attacks: Attack[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    shuffleIntoDeck: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
