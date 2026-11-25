import { Card } from '../store/card/card';
import { Stage } from '../store/card/card-types';
import type { PokemonCard } from '../store/card/pokemon-card';
import { deepClone } from '../../utils/utils';
import { CardsInfo } from './cards-info';

export class CardManager {

  private static instance: CardManager;
  private cards: Card[] = [];
  private cardIndex: { [name: string]: number } = {};
  private stageOneLinks?: ReadonlyMap<string, ReadonlySet<string>>;

  public static getInstance(): CardManager {
    if (!CardManager.instance) {
      CardManager.instance = new CardManager();
    }
    return CardManager.instance;
  }

  public defineSet(set: Card[]): void {
    for (const card of set) {
      if (this.cardIndex[card.fullName] !== undefined) {
        throw new Error('Multiple cards with the same name: ' + card.fullName);
      }

      const index = this.cards.length;
      this.cards.push(card);
      this.cardIndex[card.fullName] = index;

      const p = card as any;
      if (p.legacyFullName) {
        if (this.cardIndex[p.legacyFullName] !== undefined) {
          throw new Error('Multiple cards with the same name: ' + p.legacyFullName);
        }
        this.cardIndex[p.legacyFullName] = index;
      }
    }
  }

  public setStageOneEvolutionLinks(links: readonly (readonly [string, string])[]): void {
    const index = new Map<string, Set<string>>();
    for (const [basicName, stageOneName] of links) {
      let evolutions = index.get(basicName);
      if (!evolutions) {
        evolutions = new Set<string>();
        index.set(basicName, evolutions);
      }
      evolutions.add(stageOneName);
    }
    this.stageOneLinks = index;
  }

  public hasStageOneEvolutionLink(basicName: string, stageOneName: string,
    pokemonCard: abstract new (...args: any[]) => PokemonCard): boolean {
    if (this.stageOneLinks) return this.stageOneLinks.get(basicName)?.has(stageOneName) ?? false;
    return this.cards.some(card => card instanceof pokemonCard && card.stage === Stage.STAGE_1
      && card.name === stageOneName && card.evolvesFrom === basicName);
  }

  public replaceDefinedCards(cards: Card[]): void {
    const staged = new CardManager();
    staged.defineSet(cards);
    this.cards = staged.cards;
    this.cardIndex = staged.cardIndex;
  }

  public loadCardsInfo(cardsInfo: CardsInfo) {
    this.cardIndex = {};
    this.cards = cardsInfo.cards;
    for (let i = 0; i < this.cards.length; i++) {
      this.cardIndex[this.cards[i].fullName] = i;
    }
  }

  public defineCard(card: Card): void {
    this.cards.push(card);
  }

  public getCardByName(name: string): Card | undefined {
    const index = this.cardIndex[name];
    if (index !== undefined) {
      return deepClone(this.cards[index]);
    }
  }

  public isCardDefined(name: string): boolean {
    return this.cardIndex[name] !== undefined;
  }

  public getAllCards(): Card[] {
    return this.cards;
  }

}
