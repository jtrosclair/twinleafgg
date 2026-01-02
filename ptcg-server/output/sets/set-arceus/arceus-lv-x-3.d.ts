import { PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class ArceusLvX3 extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    tags: CardTag[];
    hp: number;
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
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private buildAttackList;
    private checkAttack;
}
