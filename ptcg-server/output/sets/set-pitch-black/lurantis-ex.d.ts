import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class Lurantisex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (CardType.GRASS | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly HEALED_THIS_TURN = "M5_LURANTIS_EX_HEALED";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
