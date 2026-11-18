import { AttachEnergyPrompt, CardList, EnergyType, GameMessage, Player, PlayerType, SlotType, State, SuperType } from 'ptcg-server';
import { ensureClientCards } from 'ptcg-server/client';
import { PromptAttachEnergyComponent } from './prompt-attach-energy.component';

describe('Energy attachment dialog', () => {
  it('keeps eligible cards and their original prompt indices after a drop and reset', () => {
    ensureClientCards();
    const state = new State();
    const player = new Player();
    player.id = 1;
    state.players = [player, new Player()];
    player.active.cards = CardList.fromList(['Kommo-o M6']).cards;
    const deckTop = CardList.fromList(['Squirtle BS', 'Water Energy SVE', 'Double Turbo Energy BRS', 'Fire Energy SVE']);
    const resolvePrompt = jasmine.createSpy('resolvePrompt');
    const dialog = new PromptAttachEnergyComponent({ resolvePrompt } as any);
    dialog.gameState = { gameId: 1, state } as any;
    dialog.prompt = new AttachEnergyPrompt(player.id, GameMessage.ATTACH_ENERGY_CARDS, deckTop,
      PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { blocked: [0, 2], max: 2 });
    dialog.prompt.id = 1;
    dialog.ngOnChanges();

    const [, water, , fire] = deckTop.cards;
    const active = dialog.pokemonData.getRows()[0].items[0];
    expect(dialog.cardListCards).toEqual([water, fire]);
    dialog.onCardDrop([active, water]);
    expect(dialog.cardListCards).toEqual([fire]);
    dialog.reset();
    expect(dialog.cardListCards).toEqual([water, fire]);
    dialog.onCardDrop([active, fire]);
    dialog.onCardDrop([active, water]);
    dialog.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(1, 1, [{ index: 3, to: active.target }, { index: 1, to: active.target }]);
  });
});
