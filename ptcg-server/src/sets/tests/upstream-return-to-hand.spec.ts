import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { BoardEffect, SuperType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { playTrainerCard } from './card-test-helpers';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const turo = "Professor Turo's Scenario PAR";
const cyclone = 'Scoop Up Cyclone TWM';
const penny = 'Penny SVI';
const milotic = 'Milotic TWM';
const mime = 'Mr. Mime TEU';
const grubbin = 'Grubbin UNB';
const vikavolt = 'Vikavolt UNB';
const charjabug = 'Charjabug UNB';
const lightning = 'Lightning Energy SVE';
const tool = 'Bravery Charm PAL';
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(config: Partial<PlayerConfig>, opponent = 'Regigigas ASR') {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: 'Mew ex MEW' }, bench: [{ card: grubbin }], deck: padDeck(12), ...config },
    player2: { active: { card: opponent }, deck: padDeck(12) }
  });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game.state.players[0];
}

function pending() {
  return store.state.prompts.find(prompt => prompt.result === undefined);
}

function choose(target = bench): void {
  const prompt = pending();
  if (!(prompt instanceof ChoosePokemonPrompt)) throw new Error('Expected a Pokémon choice');
  const result = prompt.decode([target], store.state);
  if (!prompt.validate(result, store.state)) throw new Error('Selected a blocked Pokémon');
  store.dispatch(new ResolvePromptAction(prompt.id, result));
  for (let next = pending(); next instanceof WaitPrompt; next = pending()) {
    store.dispatch(new ResolvePromptAction(next.id, true));
  }
}

describe('returning a Pokémon to hand', () => {
  it('returns the complete evolution line with Turo and discards a real Battery attachment', () => {
    const player = start({
      bench: [{ card: vikavolt, energy: [lightning], tools: [tool], damage: 20 }],
      hand: [turo, grubbin, charjabug, charjabug]
    });
    const target = player.bench[0];
    const battery = player.hand.cards[3];
    target.cards.unshift(...player.hand.cards.splice(1, 2));
    store.dispatch(new UseAbilityAction(player.id, 'Battery', {
      ...active, slot: SlotType.HAND, index: player.hand.cards.indexOf(battery)
    }));
    choose();
    expect(battery.superType).toBe(SuperType.ENERGY);
    playTrainerCard(store, store.state, 0, turo);
    choose();

    expect(player.hand.cards.map(card => card.fullName)).toEqual([grubbin, charjabug, vikavolt]);
    expect(player.discard.cards.map(card => card.fullName)).toEqual([lightning, battery.fullName, tool, turo]);
    expect(battery.superType).toBe(SuperType.POKEMON);
    expect(player.bench[0].damage).toBe(0);
    expect(player.getPrizeLeft()).toBe(6);
  });

  it('can return an in-play Snorlax Doll using Turo', () => {
    const doll = 'Snorlax Doll PAR';
    const player = start({ bench: [{ card: doll, energy: [lightning] }], hand: [turo] });
    playTrainerCard(store, store.state, 0, turo);
    choose();

    expect(player.hand.cards.map(card => card.fullName)).toEqual([doll]);
    expect(player.discard.cards.map(card => card.fullName)).toEqual([lightning, turo]);
  });

  for (const trainer of [turo, penny, cyclone]) {
    it(`resolves ${trainer} with nothing moved under opposing Mentally Calm`, () => {
      const player = start({ bench: [{ card: grubbin, energy: [lightning], tools: [tool], damage: 20 }], hand: [trainer] }, milotic);
      const target = player.bench[0];
      const attached = target.cards.slice();
      playTrainerCard(store, store.state, 0, trainer);

      expect(pending()).toBeUndefined();
      expect(player.bench[0]).toBe(target);
      expect(target.cards).toEqual(attached);
      expect(target.damage).toBe(20);
      expect(player.hand.cards).toEqual([]);
      expect(player.discard.cards.map(card => card.fullName)).toEqual([trainer]);
      expect(player.supporterTurn).toBe(trainer === cyclone ? 0 : 1);
    });
  }

  it('only offers healthy Pokémon against Scoop-Up Block and promotes after returning the Active', () => {
    const player = start({ bench: [{ card: grubbin, damage: 20, energy: [lightning] }], hand: [turo] }, mime);
    const protectedPosition = player.bench[0];
    playTrainerCard(store, store.state, 0, turo);
    const prompt = pending() as ChoosePokemonPrompt;
    expect(prompt.options.blocked).toEqual([bench]);
    expect(prompt.validate(prompt.decode([bench], store.state), store.state)).toBe(false);

    choose(active);
    if (pending() instanceof ChoosePokemonPrompt) choose();
    expect(player.active.getPokemonCard()?.fullName).toBe(grubbin);
    expect(player.active.damage).toBe(20);
    expect(player.active.energies.cards.map(card => card.fullName)).toEqual([lightning]);
    expect(player.hand.cards.map(card => card.fullName)).toEqual(['Mew ex MEW']);
    expect(protectedPosition.cards.some(card => card.fullName === lightning)).toBe(true);
  });

  for (const trainer of [penny, cyclone]) {
    it(`returns canonical and legacy mirror-only attachments once with ${trainer}`, () => {
      const player = start({ bench: [{ card: grubbin, damage: 20, energy: [lightning], tools: [tool] }], hand: [trainer] });
      const target = player.bench[0];
      const attachedEnergy = target.energies.cards[0];
      const attachedTool = target.tools[0];
      target.cards.splice(target.cards.indexOf(attachedEnergy), 1);
      target.cards.splice(target.cards.indexOf(attachedTool), 1);
      target.addBoardEffect(BoardEffect.ABILITY_USED);
      playTrainerCard(store, store.state, 0, trainer);
      choose();

      expect(player.hand.cards.map(card => card.fullName)).toEqual([lightning, tool, grubbin]);
      expect(player.discard.cards.map(card => card.fullName)).toEqual([trainer]);
      expect(target.energies.cards).toEqual([]);
      expect(target.tools).toEqual([]);
      expect(player.bench[0].cards).toEqual([]);
      expect(player.bench[0].damage).toBe(0);
      expect(player.bench[0].boardEffect).toEqual([]);
    });
  }

  it('cannot play Penny when only an evolved Pokémon is in play', () => {
    const player = start({ active: { card: vikavolt }, bench: [], hand: [penny, grubbin] });
    player.active.cards.unshift(...player.hand.cards.splice(1, 1));

    expect(() => playTrainerCard(store, store.state, 0, penny))
      .toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(player.hand.cards.map(card => card.fullName)).toEqual([penny]);
    expect(player.supporterTurn).toBe(0);
  });
});
