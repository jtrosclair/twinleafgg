import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Vibrava extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: CardType.COLORLESS[];
    readonly SAND_ATTACK_MARKER = "VIBRAVA_PRC_SAND_ATTACK_MARKER";
    readonly CLEAR_SAND_ATTACK_MARKER = "VIBRAVA_PRC_CLEAR_SAND_ATTACK_MARKER";
    readonly SAND_ATTACK_USED_MARKER = "VIBRAVA_PRC_SAND_ATTACK_USED_MARKER";
    attacks: {
        name: string;
        cost: (CardType.GRASS | CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
