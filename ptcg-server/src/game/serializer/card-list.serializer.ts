import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { CardList } from '../store/state/card-list';
import { Card } from '../store/card/card';
import { CardType } from '../store/card/card-types';
import type { PokemonEnergyRole } from '../store/card/pokemon-energy-role';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { PokemonCardList } from '../store/state/pokemon-card-list';

export class CardListSerializer implements Serializer<CardList> {

  public readonly types = ['CardList', 'PokemonCardList'];
  public readonly classes = [CardList, PokemonCardList];

  constructor() { }

  public serialize(cardList: CardList): Serialized {
    const data: any = { ...cardList };
    let constructorName = 'CardList';

    if (cardList instanceof PokemonCardList) {
      constructorName = 'PokemonCardList';
      if (cardList.tools.length > 0) {
        data.tool = cardList.tools[0].id;
      }
      const energyChoices: [number, CardType][] = [];
      for (const card of cardList.energies.cards) {
        const choice = (card as Card & Partial<PokemonEnergyRole>).getAttachedEnergyChoice?.();
        if (choice !== undefined && cardList.cards.includes(card)) energyChoices.push([card.id, choice]);
      }
      if (energyChoices.length > 0) data.energyChoices = energyChoices;
      if (cardList.showAllStageAbilities !== undefined) {
        data.showAllStageAbilities = cardList.showAllStageAbilities;
      }
    }

    // Include artworksMap if present so clients can resolve custom art
    if ((cardList as any).artworksMap) {
      data.artworksMap = (cardList as any).artworksMap;
    }

    return {
      ...data,
      _type: constructorName,
      cards: cardList.cards.map(card => card.id)
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): CardList {
    const instance = data._type === 'PokemonCardList'
      ? new PokemonCardList()
      : new CardList();

    delete (data as any)._type;

    const indexes: number[] = data.cards;
    data.cards = indexes.map(index => this.fromIndex(index, context));

    // Explicitly handle PokemonCardList properties
    if (instance instanceof PokemonCardList) {
      // If a tool is present, add it only to tools, not to cards
      if (data.tool !== undefined) {
        const toolCard = this.fromIndex(data.tool, context);
        instance.tools.push(toolCard);
      }
      // CardList stores card IDs, so the selected type belongs to the
      // attachment's slot. Reconstruct role after all references resolve.
      if (Array.isArray(data.energyChoices)) {
        for (const entry of data.energyChoices) {
          if (!Array.isArray(entry) || !Number.isInteger(entry[0]) || !Number.isInteger(entry[1])) continue;
          const card = data.cards.find((candidate: Card) => candidate.id === entry[0]) as (Card & Partial<PokemonEnergyRole>) | undefined;
          card?.restoreAttachedEnergyChoice?.(entry[1]);
        }
      }
      delete data.energyChoices;
      instance.showBasicAnimation = data.showBasicAnimation || false;
      instance.triggerEvolutionAnimation = data.triggerEvolutionAnimation || false;
      instance.triggerAttackAnimation = data.triggerAttackAnimation || false;
    }

    return Object.assign(instance, data);
  }

  private fromIndex(index: number, context: SerializerContext): Card {
    const card = context.cards[index];
    if (card === undefined) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
    }
    return card;
  }

}
