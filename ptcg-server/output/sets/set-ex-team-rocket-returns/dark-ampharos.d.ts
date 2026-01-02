import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class DarkAmpharos extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    additionalCardTypes: CardType.DARK[];
    tags: CardTag[];
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    evolvesFrom: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
