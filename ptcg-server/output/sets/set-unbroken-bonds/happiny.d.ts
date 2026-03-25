import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Happiny extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: any[];
    readonly PLAYHOUSE_HEAL_MARKER = "HAPPINY_PLAYHOUSE_HEAL_MARKER";
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
