import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
export declare class Rampardosex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly DESTRUCTIVE_HEADBUTT_MARKER = "RAMPARDOS_EX_DESTRUCTIVE_HEADBUTT_MARKER";
    readonly RAMPAGING_HAMMER_MARKER = "RAMPARDOS_EX_RAMPAGING_HAMMER_MARKER";
    readonly CLEAR_RAMPAGING_HAMMER_MARKER = "RAMPARDOS_EX_CLEAR_RAMPAGING_HAMMER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
