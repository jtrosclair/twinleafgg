import { EnergyCard } from '../card/energy-card';
import { EnergyType, Format, SuperType, TrainerType } from '../card/card-types';
import { Player } from '../state/player';
import { State } from '../state/state';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from './prefabs';

class SearchEnergy extends EnergyCard {
  public set = 'TEST';
  public format = Format.NONE;
  public fullName = 'Fire Energy TEST';
  public name = 'Fire Energy';
  public energyType = EnergyType.BASIC;
}

describe('SEARCH_DECK_FOR_CARDS_TO_HAND selection requirements', () => {
  it('requires an Energy when an Energy search has a matching card', () => {
    const player = new Player();
    const opponent = new Player();
    player.id = 1;
    opponent.id = 2;
    player.deck.cards.push(new SearchEnergy());
    const state = Object.assign(new State(), { players: [player, opponent] });
    let captured: any;
    const store = { prompt: (_state: State, prompt: any) => { captured = prompt; } } as any;

    SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, new SearchEnergy(),
      { superType: SuperType.ENERGY }, { min: 0, max: 1 });

    expect(captured.options.min).toBe(1);
  });

  it('keeps non-Energy deck searches optional by default', () => {
    const player = new Player();
    const opponent = new Player();
    player.id = 1;
    opponent.id = 2;
    player.deck.cards.push(new SearchEnergy());
    const state = Object.assign(new State(), { players: [player, opponent] });
    let captured: any;
    const store = { prompt: (_state: State, prompt: any) => { captured = prompt; } } as any;

    SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, new SearchEnergy(),
      { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM } as any, { min: 1, max: 1 });

    expect(captured.options.min).toBe(0);
  });
});
