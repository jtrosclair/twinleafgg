import { GameMessage, PokemonCard, State, Store } from '../../game';
import { GrassEnergy } from '../set-scarlet-and-violet-energy/grass-energy';
import { LuminousEnergy } from '../set-paldea-evolved/luminous-energy';
import { Delibird } from '../set-delta-reign/delibird';
import { Player } from '../../game/store/state/player';
import { GamePhase } from '../../game/store/state/state';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';

class BasicFixture extends PokemonCard {
  public name = 'Basic Fixture';
  public fullName = 'Basic Fixture TST';
  public set = 'TST';
  public hp = 100;
}

function setup(findsEnergy = true, deckLength = 8) {
  const state = new State();
  const player = new Player();
  const opponent = new Player();
  player.id = 1;
  opponent.id = 2;
  state.players = [player, opponent];
  state.phase = GamePhase.PLAYER_TURN;
  state.turn = 3;
  const delibird = new Delibird();
  player.active.cards = [delibird];
  opponent.active.cards = [new BasicFixture()];
  const deck = Array.from({ length: deckLength }, (_, index) => {
    const card = findsEnergy && index === 0 ? new LuminousEnergy()
      : index === 6 ? new GrassEnergy() : new BasicFixture();
    card.id = index + 1;
    return card;
  });
  player.deck.cards = [...deck];
  const store = new Store({ onStateChange: () => undefined });
  store.state = state;
  const use = () => store.reduceEffect(state, new PowerEffect(player, delibird.powers[0], delibird));
  const pending = <T>(type: new (...args: any[]) => T) =>
    state.prompts.find(prompt => prompt instanceof type && prompt.result === undefined) as T | undefined;
  const resolve = <T>(prompt: { id: number }, result: T) => {
    (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, result));
  };
  return { player, opponent, deck, use, pending, resolve };
}

describe('Delibird MEE Energizing Present', () => {
  it('permits zero when the private look finds an Energy and shuffles exactly the six looked at', () => {
    const x = setup();
    x.use();
    const look = x.pending(ShowCardsPrompt)!;
    expect(look.playerId).toBe(x.player.id);
    expect(look.sourcePlayerId).toBe(x.player.id);
    expect(look.message).toBe(GameMessage.CARDS_SHOWED_BY_EFFECT);
    expect(look.cards).toEqual(x.deck.slice(0, 6));
    x.resolve(look, true);
    const choose = x.pending(ChooseCardsPrompt)!;
    expect(choose.validate([])).toBe(true);
    x.resolve(choose, []);
    expect(x.pending(ShowCardsPrompt)).toBeUndefined();
    const shuffle = x.pending(ShuffleDeckPrompt)!;
    expect(shuffle.count).toBe(6);
    x.resolve(shuffle, [5, 4, 3, 2, 1, 0]);
    expect(x.player.deck.cards).toEqual([...x.deck.slice(6), ...x.deck.slice(0, 6).reverse()]);
    expect(x.player.hand.cards).toEqual([]);
  });

  it('reveals a chosen Special Energy before adding it to hand and shuffles the other five', () => {
    const x = setup();
    x.use();
    x.resolve(x.pending(ShowCardsPrompt)!, true);
    const choose = x.pending(ChooseCardsPrompt)!;
    expect(choose.validate([x.deck[0]])).toBe(true);
    expect(choose.validate([x.deck[1]])).toBe(false);
    x.resolve(choose, [x.deck[0]]);
    expect(x.player.hand.cards).toEqual([]);
    expect(x.pending(ShuffleDeckPrompt)).toBeUndefined();
    const reveal = x.pending(ShowCardsPrompt)!;
    expect(reveal.playerId).toBe(x.opponent.id);
    expect(reveal.sourcePlayerId).toBe(x.player.id);
    expect(reveal.cards).toEqual([x.deck[0]]);
    x.resolve(reveal, true);
    expect(x.player.hand.cards).toEqual([x.deck[0]]);
    const shuffle = x.pending(ShuffleDeckPrompt)!;
    expect(shuffle.count).toBe(5);
    x.resolve(shuffle, [4, 3, 2, 1, 0]);
    expect(x.player.deck.cards).toEqual([...x.deck.slice(6), ...x.deck.slice(1, 6).reverse()]);
  });

  it('shows all cards of a short deck even when none are Energy', () => {
    const x = setup(false, 3);
    x.use();
    const look = x.pending(ShowCardsPrompt)!;
    expect(look.cards).toEqual(x.deck);
    x.resolve(look, true);
    expect(x.pending(ChooseCardsPrompt)).toBeUndefined();
    const shuffle = x.pending(ShuffleDeckPrompt)!;
    expect(shuffle.count).toBe(3);
    x.resolve(shuffle, [1, 2, 0]);
    expect(x.player.deck.cards).toEqual([x.deck[1], x.deck[2], x.deck[0]]);
  });
});
