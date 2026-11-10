import { CardList, CardTag, CardType, PokemonCard, PokemonCardList, TrainerCard } from 'ptcg-server';
import { BoardCardComponent } from './board-card.component';

class Basic extends PokemonCard {
  name = 'Basic'; fullName = 'Basic TEST'; hp = 100; cardType = CardType.GRASS;
}
class Trainer extends TrainerCard { name = 'Trainer'; fullName = 'Trainer TEST'; }

describe('board HP badge', () => {
  let component: BoardCardComponent;
  let list: PokemonCardList;

  beforeEach(() => {
    component = new BoardCardComponent({} as any, { nativeElement: {} } as any);
    list = new PokemonCardList();
    list.isPublic = true;
    list.cards = [new Basic()];
  });

  it('shows maximum HP independently of damage', () => {
    list.damage = 70;
    component.cardList = list;
    expect(component.maxHp).toBe(100);
    expect(component.hpModifier).toBe('base');
    expect(component.damage).toBe(70);
    expect(component.hpLabel).toContain('100 maximum HP (base 100)');
  });

  it('compares modified maximum HP with base and resets when the modifier is removed', () => {
    for (const [bonus, hp, modifier] of [[50, 150, 'increased'], [-30, 70, 'decreased'], [0, 100, 'base']]) {
      list.hpBonus = bonus as number;
      component.cardList = list;
      expect(component.maxHp).toBe(hp as number);
      expect(component.hpModifier).toBe(modifier as any);
    }
  });

  it('renders every printed type once when effective types have not been computed', () => {
    (list.cards[0] as PokemonCard).additionalCardTypes = [CardType.WATER, CardType.GRASS];
    component.cardList = list;
    expect(component.pokemonTypes).toEqual([CardType.GRASS, CardType.WATER]);
  });

  it('uses current types supplied by the simulator, including type replacement', () => {
    list.cardTypes = [CardType.FIRE, CardType.PSYCHIC, CardType.FIRE];
    component.cardList = list;
    expect(component.pokemonTypes).toEqual([CardType.FIRE, CardType.PSYCHIC]);
    expect(component.hpLabel).toContain('FIRE, PSYCHIC');
  });

  it('uses the top evolved or BREAK Pokemon for HP even when its base artwork is displayed', () => {
    const evolution = new Basic();
    evolution.hp = 160;
    evolution.tags = [CardTag.BREAK];
    evolution.cardType = CardType.WATER;
    list.cards.push(evolution);
    list.hpBonus = 30;
    component.cardList = list;
    expect(component.mainCard).toBe(list.cards[0]);
    expect(component.maxHp).toBe(190);
    expect(component.pokemonTypes).toEqual([CardType.WATER]);
  });

  it('clears the badge for empty slots and non-Pokemon piles', () => {
    component.cardList = list;
    component.cardList = new PokemonCardList();
    expect(component.maxHp).toBeUndefined();
    expect(component.pokemonTypes).toEqual([]);
    const stadium = new CardList(); stadium.isPublic = true; stadium.cards = [new Trainer()];
    component.cardList = stadium;
    expect(component.maxHp).toBeUndefined();
    expect(component.hpLabel).toBe('');
  });
});
