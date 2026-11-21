import { AttachEnergyPrompt, CardList, CardType, EnergyType, GameMessage, Player, PlayerType, SlotType, State, SuperType } from 'ptcg-server';
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

  it('offers legal types and prevents duplicate types while the player fills a required selection', () => {
    ensureClientCards();
    const state = new State();
    const player = new Player();
    player.id = 1;
    state.players = [player, new Player()];
    player.active.cards = CardList.fromList(['Kommo-o M6']).cards;
    const discard = CardList.fromList(['Water Energy SVE', 'Fire Energy SVE', 'Fire Energy SVE', 'Fighting Energy SVE']);
    const resolvePrompt = jasmine.createSpy('resolvePrompt');
    const dialog = new PromptAttachEnergyComponent({ resolvePrompt } as any);
    dialog.gameState = { gameId: 1, state } as any;
    dialog.prompt = new AttachEnergyPrompt(player.id, GameMessage.ATTACH_ENERGY_CARDS, discard,
      PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: 2, max: 2, validCardTypes: [CardType.FIRE, CardType.FIGHTING], differentTypes: true });
    dialog.prompt.id = 1;
    dialog.ngOnChanges();

    const [water, fire, otherFire, fighting] = discard.cards;
    const active = dialog.pokemonData.getRows()[0].items[0];
    expect(dialog.cardListCards).not.toContain(water);
    dialog.onCardDrop([active, fire]);
    dialog.onCardDrop([active, otherFire]);
    expect(dialog.results.map(result => result.card)).toEqual([fire]);
    dialog.confirm();
    expect(resolvePrompt).not.toHaveBeenCalled();
    dialog.onCardDrop([active, fighting]);
    dialog.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(1, 1, [{ index: 1, to: active.target }, { index: 3, to: active.target }]);
  });
});
