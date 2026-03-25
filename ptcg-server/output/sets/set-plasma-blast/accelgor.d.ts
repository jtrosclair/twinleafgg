import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export declare class Accelgor extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: any[];
    attacks: {
        name: string;
        cost: (CardType.GRASS | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly ESCAVALIER_KO_MARKER = "ESCAVALIER_KO_MARKER";
    readonly ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER = "ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
