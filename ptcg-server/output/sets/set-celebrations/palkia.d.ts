import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Palkia extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: "+";
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly OVERDRIVE_SMASH_BONUS_MARKER = "PALKIA_CEL_OVERDRIVE_SMASH_BONUS_MARKER";
    readonly OVERDRIVE_SMASH_CLEAR_MARKER = "PALKIA_CEL_OVERDRIVE_SMASH_CLEAR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
