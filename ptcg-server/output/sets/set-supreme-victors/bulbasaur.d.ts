import { Attack, CardType, PokemonCard, Stage } from '../../game';
export declare class Bulbasaur extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: Attack[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
}
