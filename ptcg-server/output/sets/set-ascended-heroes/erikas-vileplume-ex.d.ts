import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ErikasVileplumeex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: any[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.GRASS | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly ENVIOUS_SCENT_MARKER = "ENVIOUS_SCENT_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
