import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Dragonite extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.LIGHTNING | CardType.FIGHTING)[];
        damage: number;
        damageCalculationn: string;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly TAILWIND_MARKER = "TAILWIND_MARKER";
    readonly TAILWIND_USED_MARKER = "TAILWIND_USED_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
