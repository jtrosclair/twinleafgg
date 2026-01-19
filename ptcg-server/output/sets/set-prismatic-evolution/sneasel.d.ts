import { CardType, Stage } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
export declare class Sneasel extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    regulationMark: string;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: any[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
