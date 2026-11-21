import { CardList, GameMessage, MoveDamagePrompt, PokemonCardList, RemoveDamagePrompt, Player, PlayerType, SlotType, State } from 'ptcg-server';
import { ensureClientCards } from 'ptcg-server/client';
import { PromptMoveDamageComponent } from './prompt-move-damage.component';
import { PromptRemoveDamageComponent } from '../prompt-remove-damage/prompt-remove-damage.component';

describe('Damage counter movement dialog', () => {
  it('moves counters between eligible Pokémon when each is restricted to one role', () => {
    ensureClientCards();
    const state = new State();
    const player = new Player();
    const opponent = new Player();
    player.id = 1;
    opponent.id = 2;
    state.players = [player, opponent];
    player.active.cards = CardList.fromList(['Pidgey MEW']).cards;
    player.active.damage = 30;
    opponent.active.cards = CardList.fromList(['Pidgey MEW']).cards;
    opponent.active.damage = 10;

    const from = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const to = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const resolvePrompt = jasmine.createSpy('resolvePrompt');
    const dialog = new PromptMoveDamageComponent({ resolvePrompt } as any);
    dialog.gameState = { gameId: 3, state } as any;
    dialog.prompt = new MoveDamagePrompt(player.id, GameMessage.MOVE_DAMAGE, PlayerType.ANY,
      [SlotType.ACTIVE], [{ target: to, damage: 9999 }],
      { min: 1, max: 3, blockedFrom: [to], blockedTo: [from], allowCancel: false });
    dialog.prompt.id = 4;
    dialog.ngOnChanges();

    dialog.onCardClick(dialog.pokemonData.getItemByTarget(from)!);
    expect(dialog.isRemoveDisabled).toBe(false);
    dialog.removeDamage();
    expect(dialog.isAddDisabled).toBe(true);
    dialog.addDamage();
    expect(dialog.damage).toBe(10);

    dialog.onCardClick(dialog.pokemonData.getItemByTarget(to)!);
    expect(dialog.isRemoveDisabled).toBe(true);
    expect(dialog.isAddDisabled).toBe(false);
    dialog.removeDamage();
    expect(dialog.damage).toBe(10);
    dialog.addDamage();
    expect(dialog.isInvalid).toBe(false);
    dialog.confirm();

    expect(resolvePrompt).toHaveBeenCalledWith(3, 4, [{ from, to }]);
    expect(player.active.damage).toBe(30);
    expect(opponent.active.damage).toBe(10);
  });

  it('keeps Adrena-Brain on one damaged source and one opposing recipient', () => {
    ensureClientCards();
    const state = new State();
    const player = new Player();
    const opponent = new Player();
    player.id = 1;
    opponent.id = 2;
    state.players = [player, opponent];
    player.bench.push(new PokemonCardList());
    opponent.bench.push(new PokemonCardList());
    for (const slot of [player.active, player.bench[0], opponent.active, opponent.bench[0]]) {
      slot.cards = CardList.fromList(['Pidgey MEW']).cards;
      slot.damage = 30;
    }
    const from = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const otherSource = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
    const to = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const otherRecipient = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
    const resolvePrompt = jasmine.createSpy('resolvePrompt');
    const dialog = new PromptRemoveDamageComponent({ resolvePrompt } as any);
    dialog.gameState = { gameId: 3, state } as any;
    dialog.prompt = new RemoveDamagePrompt(player.id, GameMessage.MOVE_DAMAGE, PlayerType.ANY,
      [SlotType.ACTIVE, SlotType.BENCH], [], { min: 1, max: 3, sameTarget: true, singleSourceTarget: true,
        blockedFrom: [to, otherRecipient], blockedTo: [from, otherSource] });
    dialog.prompt.id = 4;
    dialog.ngOnChanges();
    dialog.onCardClick(dialog.pokemonData.getItemByTarget(from)!);
    dialog.removeDamage();
    dialog.removeDamage();
    dialog.onCardClick(dialog.pokemonData.getItemByTarget(otherSource)!);
    expect(dialog.isRemoveDisabled).toBe(true);
    dialog.removeDamage();
    dialog.onCardClick(dialog.pokemonData.getItemByTarget(to)!);
    expect(dialog.isRemoveDisabled).toBe(true);
    dialog.addDamage();
    dialog.onCardClick(dialog.pokemonData.getItemByTarget(otherRecipient)!);
    expect(dialog.isAddDisabled).toBe(true);
    dialog.addDamage();
    dialog.onCardClick(dialog.pokemonData.getItemByTarget(to)!);
    dialog.addDamage();
    expect(dialog.isInvalid).toBe(false);
    dialog.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(3, 4, [{ from, to }, { from, to }]);
  });

});
