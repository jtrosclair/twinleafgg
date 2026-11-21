import { Card } from '../store/card/card';
import { CardManager } from './card-manager';
import { EnergyCard } from '../store/card/energy-card';
import { EnergyType, Stage, CardType, CardTag, Format } from '../store/card/card-types';
import { PokemonCard } from '../store/card/pokemon-card';

export class DeckAnalyser {

  private cards: Card[];

  constructor(public cardNames: string[] = []) {
    const cardManager = CardManager.getInstance();
    this.cards = [];

    cardNames.forEach(name => {
      const card = cardManager.getCardByName(name);
      if (card !== undefined) {
        this.cards.push(card);
      }
    });
  }

  public isValid(format?: Format): boolean {
    const countMap: { [name: string]: number } = {};
    const prismStarCards = new Set<string>();
    let hasBasicPokemon = false;
    let hasAceSpec = false;
    let hasRadiant = false;
    let hasStar = false;

    // Pre-Release format uses 40 cards, all other formats use 60
    const requiredDeckSize = format === Format.PRE_RELEASE ? 40 : 60;
    if (this.cards.length !== requiredDeckSize) {
      return false;
    }

    // Check for invalid Professor/Boss combinations
    const cardSet = new Set(this.cards.map(c => c.name));
    if ((cardSet.has('Professor Sycamore') && cardSet.has('Professor Juniper')) ||
      (cardSet.has('Professor Juniper') && cardSet.has('Professor\'s Research')) ||
      (cardSet.has('Professor Sycamore') && cardSet.has('Professor\'s Research')) ||
      (cardSet.has('Lysandre') && cardSet.has('Boss\'s Orders'))) {
      return false;
    }

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card instanceof PokemonCard && card.stage === Stage.BASIC) {
        hasBasicPokemon = true;
      }

      const isBasicEnergy = card instanceof EnergyCard && card.energyType === EnergyType.BASIC;
      const hasArceusRule = card.name === 'Arceus' && card.tags.includes(CardTag.ARCEUS);
      if (!isBasicEnergy && !hasArceusRule) {
        // The Neo print uses a shared Unown limit. Diamond & Pearl letters have distinct names.
        const deckName = card.set === 'N2' && card.tags.includes(CardTag.UNOWN) ? 'Unown' : card.name;
        countMap[deckName] = (countMap[deckName] || 0) + 1;
        if (countMap[deckName] > 4) {
          return false;
        }
      }

      if (card.tags.includes(CardTag.ACE_SPEC)) {
        if (hasAceSpec) {
          return false;
        }
        hasAceSpec = true;
      }

      if (card.tags.includes(CardTag.RADIANT)) {
        if (hasRadiant) {
          return false;
        }
        hasRadiant = true;
      }

      if (card.tags.includes(CardTag.STAR)) {
        if (hasStar) {
          return false;
        }
        hasStar = true;
      }

      if (card.tags.includes(CardTag.PRISM_STAR)) {
        if (prismStarCards.has(card.name)) {
          return false;
        }
        prismStarCards.add(card.name);
      }
    }

    return hasBasicPokemon;
  }


  public getDeckType(): CardType[] {
    const cardTypes: CardType[] = [];

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      let cardType = CardType.NONE;

      if (card instanceof PokemonCard) {
        cardType = card.cardType;
        if (cardType !== CardType.NONE && cardTypes.indexOf(cardType) === -1) {
          cardTypes.push(cardType);
        }
      }
    }
    return cardTypes;
  }
}


