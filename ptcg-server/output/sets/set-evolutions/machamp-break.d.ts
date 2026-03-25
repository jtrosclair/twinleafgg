import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MachampBreak extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    retreat: any[];
    attacks: {
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly BOOMERANG_MARKER = "MACHAMP_BREAK_EVO_BOOMERANG";
    readonly CLEAR_BOOMERANG_MARKER = "MACHAMP_BREAK_EVO_CLEAR_BOOMERANG";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
