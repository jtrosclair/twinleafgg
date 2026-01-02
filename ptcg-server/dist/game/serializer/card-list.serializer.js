import { CardList } from '../store/state/card-list';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { PokemonCardList } from '../store/state/pokemon-card-list';
export class CardListSerializer {
    constructor() {
        this.types = ['CardList', 'PokemonCardList'];
        this.classes = [CardList, PokemonCardList];
    }
    serialize(cardList) {
        const data = Object.assign({}, cardList);
        let constructorName = 'CardList';
        if (cardList instanceof PokemonCardList) {
            constructorName = 'PokemonCardList';
            if (cardList.tools.length > 0) {
                data.tool = cardList.tools[0].id;
            }
            if (cardList.showAllStageAbilities !== undefined) {
                data.showAllStageAbilities = cardList.showAllStageAbilities;
            }
        }
        // Include artworksMap if present so clients can resolve custom art
        if (cardList.artworksMap) {
            data.artworksMap = cardList.artworksMap;
        }
        return Object.assign(Object.assign({}, data), { _type: constructorName, cards: cardList.cards.map(card => card.id) });
    }
    deserialize(data, context) {
        const instance = data._type === 'PokemonCardList'
            ? new PokemonCardList()
            : new CardList();
        delete data._type;
        const indexes = data.cards;
        data.cards = indexes.map(index => this.fromIndex(index, context));
        // Explicitly handle PokemonCardList properties
        if (instance instanceof PokemonCardList) {
            // If a tool is present, add it only to tools, not to cards
            if (data.tool !== undefined) {
                const toolCard = this.fromIndex(data.tool, context);
                instance.tools.push(toolCard);
            }
            instance.showBasicAnimation = data.showBasicAnimation || false;
            instance.triggerEvolutionAnimation = data.triggerEvolutionAnimation || false;
            instance.triggerAttackAnimation = data.triggerAttackAnimation || false;
        }
        return Object.assign(instance, data);
    }
    fromIndex(index, context) {
        const card = context.cards[index];
        if (card === undefined) {
            throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
        }
        return card;
    }
}
