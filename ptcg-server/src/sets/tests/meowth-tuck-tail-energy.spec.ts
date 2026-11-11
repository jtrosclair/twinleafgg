import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Card } from '../../game/store/card/card';
import { SuperType } from '../../game/store/card/card-types';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { UseAbilityAction, PassTurnAction, AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { clearCopyAttackSessionsForTests, cloneAttacks, openCopyAttackSession } from '../../game/store/prefabs/copy-attack-delegation';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { padDeck, setupGame, getCardByName } from './test-helpers';
import { useAbility, useAttack, playTrainerCard } from './card-test-helpers';
import { ClientSimulator } from '../../client/simulator';
import { Base64 } from '../../utils/base64';

const fire = 'Fire Energy SVE';
const holons = ["Holon's Magnemite DS", "Holon's Voltorb DS", "Holon's Magneton DS",
  "Holon's Electrode DS", "Holon's Castform HP"];
type Game = ReturnType<typeof setupGame>;

function game(copied: boolean, name = holons[0], tool = 'Bravery Charm PAL') {
  const g = setupGame({ turn: 5,
    player1: { active: { card: copied ? 'Mew ex 30C' : 'Meowth ex POR', energy: [fire, fire, fire], tools: tool ? [tool] : [] },
      bench: copied ? [{ card: 'Meowth ex POR' }, { card: 'Charmander BS', energy: [fire] }]
        : [{ card: 'Charmander BS', energy: [fire] }], hand: [name, name], deck: padDeck(20) },
    player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(20) }
  });
  g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
  return g;
}

function attach(g: Game, card: Card) {
  const player = g.store.state.players[0];
  g.store.dispatch(new UseAbilityAction(player.id, card.powers[0].name,
    { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: player.hand.cards.indexOf(card) }));
}

function serialize(state: State) {
  const all: Card[] = [];
  for (const player of state.players) {
    for (const list of [player.active, ...player.bench, player.hand, player.deck, player.discard,
      player.lostzone, player.supporter, player.stadium, ...player.prizes]) {
      const cards = list instanceof PokemonCardList ? [...list.cards, ...list.energies.cards, ...list.tools] : list.cards;
      for (const card of cards) if (!all.includes(card)) all.push(card);
    }
  }
  all.forEach((card, index) => card.id = index);
  state.cardNames = all.map(card => card.fullName);
  StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());
  return new StateSerializer().serialize(state);
}

function restore(g: Game) {
  const wire = serialize(g.store.state);
  g.store.restoreState(new StateSerializer().deserialize(wire));
  return wire;
}

function tuckTail(g: Game, copied: boolean) {
  g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER,
    slot: SlotType.BENCH, index: copied ? 1 : 0 }]);
  if (copied) {
    g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Tuck Tail' }));
    useAbility(g.store, g.store.state, 0, 'Memory Helix');
  } else useAttack(g.store, g.store.state, 0, 'Tuck Tail');
}

function expectReturned(g: Game, source: PokemonCardList, cards: Card[]) {
  const player = g.store.state.players[0];
  for (const card of cards) {
    expect(player.hand.cards.filter(item => item === card).length).toBe(1);
    expect(player.discard.cards).not.toContain(card);
    for (const slot of [player.active, ...player.bench]) {
      expect(slot.cards).not.toContain(card);
      expect(slot.energies.cards).not.toContain(card);
      expect(slot.tools).not.toContain(card);
    }
  }
  expect(source.cards.length).toBe(0);
  expect(source.energies.cards.length).toBe(0);
  expect(source.tools.length).toBe(0);
}

describe('Meowth Tuck Tail returns physical Pokemon-as-Energy attachments', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  for (const name of holons) for (const loaded of [false, true]) for (const copied of [false, true]) {
    it('returns each physical attachment once, ' + name + ', restored=' + loaded + ', copied=' + copied, () => {
      const g = game(copied, name), physical = g.player1.hand.cards[0];
      attach(g, physical);
      expect(physical.superType).toBe(SuperType.ENERGY);
      if (loaded) restore(g);
      const state = g.store.state, player = state.players[0], source = player.active;
      const returned = [...source.cards], sourceMeowth = copied ? player.bench[0].getPokemonCard() : undefined;
      const promotion = player.bench[copied ? 1 : 0].getPokemonCard()!;
      const separateCopy = player.hand.cards.find(card => card.fullName === name)!;
      tuckTail(g, copied);
      expect(state.players[1].active.damage).toBe(60);
      expectReturned(g, source, returned);
      expect(player.active.getPokemonCard()).toBe(promotion);
      expect(player.active.energies.cards.length).toBe(1);
      expect(player.hand.cards).toContain(separateCopy);
      expect(separateCopy.superType).toBe(SuperType.POKEMON);
      if (sourceMeowth) {
        expect(player.hand.cards).not.toContain(sourceMeowth);
        expect(player.bench[0].getPokemonCard()).toBe(sourceMeowth);
      }
    });
  }

  for (const copied of [false, true]) it('returns normal Energy and a real Tool without needing a Holon, copied=' + copied, () => {
    const g = game(copied), player = g.player1, source = player.active, returned = [...source.cards];
    tuckTail(g, copied);
    expectReturned(g, source, returned);
    expect(g.player2.active.damage).toBe(60);
  });

  for (const copied of [false, true]) it('returns the same attachment again after restore, promotion and next-turn reattachment, copied=' + copied, () => {
    const g = game(copied), original = g.player1.hand.cards[0]; attach(g, original); restore(g);
    const player = g.store.state.players[0], card = player.active.energies.cards.find(item => item.fullName === holons[0])!;
    tuckTail(g, copied);
    expect(player.hand.cards.filter(item => item === card).length).toBe(1);
    const activePlayer = g.store.state.players[g.store.state.activePlayer];
    g.store.dispatch(new PassTurnAction(activePlayer.id));
    g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
    attach(g, card);
    expect(player.hand.cards).not.toContain(card);
    expect(player.active.cards.filter(item => item === card).length).toBe(1);
    expect(player.active.energies.cards.filter(item => item === card).length).toBe(1);
    expect(card.superType).toBe(SuperType.ENERGY);
    const wire = restore(g), serializer = new StateSerializer();
    const restored = g.store.state.players[0].active.energies.cards.find(item => item.id === card.id)!;
    expect(restored.superType).toBe(SuperType.ENERGY);
    expect(serializer.serialize(serializer.deserialize(wire))).toBe(wire);
  });

  for (const copied of [false, true]) for (const loaded of [false, true]) {
    it('returns a real Unown Pokemon Tool together with Energy, restored=' + loaded + ', copied=' + copied, () => {
      const g = game(copied, holons[0], ''), unown = getCardByName('Unown Q MD');
      unown.id = 5000; g.player1.bench[2].cards.push(unown);
      attach(g, g.player1.hand.cards[0]);
      g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
      useAbility(g.store, g.store.state, 0, 'Quick');
      expect(g.player1.active.tools).toContain(unown);
      expect(g.player1.bench[2].cards).not.toContain(unown);
      if (loaded) restore(g);
      const source = g.store.state.players[0].active, returned = [...source.cards];
      expect(source.getPokemons().length).toBe(1);
      tuckTail(g, copied);
      expectReturned(g, source, returned);
      expect(g.store.state.players[1].active.damage).toBe(60);
    });

    it('returns two separately attached physical copies, restored=' + loaded + ', copied=' + copied, () => {
      const g = game(copied), first = g.player1.hand.cards[0], second = g.player1.hand.cards[1];
      attach(g, first);
      for (let i = 0; i < 2; i++) {
        const player = g.store.state.players[g.store.state.activePlayer];
        g.store.dispatch(new PassTurnAction(player.id));
      }
      g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
      attach(g, second);
      if (loaded) restore(g);
      const source = g.store.state.players[0].active, returned = [...source.cards];
      const attachments = source.energies.cards.filter(card => card.fullName === holons[0]);
      expect(attachments.length).toBe(2); expect(attachments[0]).not.toBe(attachments[1]);
      tuckTail(g, copied);
      expectReturned(g, source, returned);
      expect(g.store.state.players[0].hand.cards.filter(card => card.fullName === holons[0]).length).toBe(2);
    });

    it('keeps attachments through two legal Switch actions before returning them, restored=' + loaded + ', copied=' + copied, () => {
      const g = game(copied), slot = g.player1.active, physical = g.player1.hand.cards[0];
      attach(g, physical);
      for (let i = 0; i < 2; i++) {
        const switchCard = getCardByName('Switch SVI'); switchCard.id = 6000 + i;
        g.player1.hand.cards.push(switchCard);
        g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: copied ? 1 : 0 }]);
        playTrainerCard(g.store, g.store.state, 0, 'Switch SVI');
        expect(slot.cards).toContain(physical); expect(slot.energies.cards).toContain(physical);
      }
      expect(g.player1.active).toBe(slot);
      if (loaded) restore(g);
      const source = g.store.state.players[0].active, returned = [...source.cards];
      tuckTail(g, copied);
      expectReturned(g, source, returned);
      expect(g.store.state.players[0].discard.cards.filter(card => card.fullName === 'Switch SVI').length).toBe(2);
    });
  }

  for (const loaded of [false, true]) it('the delegated AfterAttack handler returns a legally evolved copycat and its full stack, restored=' + loaded, () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Zorua BLW', energy: [fire, fire, fire], tools: ['Bravery Charm PAL'] },
        bench: [{ card: 'Charmander BS' }], hand: [holons[0], 'Zoroark BLW'], deck: padDeck(12) },
      player2: { active: { card: 'Meowth ex POR' }, deck: padDeck(12) }
    });
    g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
    attach(g, g.player1.hand.cards[0]);
    g.store.dispatch(new PlayCardAction(g.player1.id, g.player1.hand.cards.findIndex(card => card.fullName === 'Zoroark BLW'),
      { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }));
    expect(g.player1.active.getPokemons().length).toBe(2);
    if (loaded) restore(g);
    const state = g.store.state, player = state.players[0], opponent = state.players[1];
    const source = player.active, returned = [...source.cards], defender = opponent.active.getPokemonCard()!;
    // Isolate Meowth's delegated handler on a legitimate two-card stack. Legacy
    // Foul Play itself has a separate pre-existing missing-AfterAttack defect.
    state.phase = GamePhase.ATTACK;
    const attacks = cloneAttacks(defender.attacks);
    openCopyAttackSession(state, player, source.getPokemonCard()!, defender, attacks, attacks[0]);
    const attack = new AttackEffect(player, opponent, attacks[0]);
    g.store.reduceEffect(state, attack);
    g.store.reduceEffect(state, new DealDamageEffect(attack, attack.damage));
    g.store.reduceEffect(state, new AfterAttackEffect(player, opponent, attacks[0]));
    expectReturned(g, source, returned);
    expect(g.store.state.players[1].active.damage).toBe(60);
    expect(g.store.state.players[1].active.getPokemonCard()).toBe(defender);
  });

  for (const copied of [false, true]) it('handles a legacy Tool stored only in tools without changing its identity, copied=' + copied, () => {
    const g = game(copied), source = g.player1.active, tool = source.tools[0];
    source.cards = source.cards.filter(card => card !== tool);
    attach(g, g.player1.hand.cards[0]); restore(g);
    const restoredSource = g.store.state.players[0].active;
    const returned = [...restoredSource.cards, ...restoredSource.tools];
    tuckTail(g, copied);
    expectReturned(g, restoredSource, returned);
  });

  for (const copied of [false, true]) it('keeps the public simulator rewind/reset and emitted snapshots playable, copied=' + copied, () => {
    const g = game(copied); attach(g, g.player1.hand.cards[0]);
    const sim = new ClientSimulator();
    sim.loadSnapshot({ stateData: new Base64().encode(serialize(g.store.state)) });
    const initial = sim.getStateData(), firstPlayer = sim.state.players[0];
    const returnedIds = firstPlayer.active.cards.map(card => card.id);
    const run = () => {
      if (copied) {
        sim.dispatch(new UseAbilityAction(sim.humanPlayerId, 'Memory Helix',
          { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }));
        const attackPrompt = sim.state.prompts.find(prompt => prompt.result === undefined && prompt.type === 'Choose attack')!;
        sim.resolvePrompt(attackPrompt.id, { index: 0, attack: 'Tuck Tail' });
      } else sim.dispatch(new AttackAction(sim.humanPlayerId, 'Tuck Tail'));
      const player = sim.state.players[0], promotion = sim.state.prompts.find(prompt => prompt.result === undefined && prompt.type === 'Choose pokemon')!;
      expect(promotion).toBeDefined(); expect(sim.complete).toBe(false);
      expect(player.active.cards.length).toBe(0); expect(player.active.energies.cards.length).toBe(0);
      expect(player.active.tools.length).toBe(0);
      for (const id of returnedIds) expect(player.hand.cards.filter(card => card.id === id).length).toBe(1);
      sim.resolvePrompt(promotion.id, [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: copied ? 1 : 0 }]);
      expect(sim.complete).toBe(true);
      const full = new StateSerializer().deserialize(new Base64().decode(sim.getStateData()));
      expect(full.players[0].active.getPokemonCard()!.fullName).toBe('Charmander BS');
      expect(full.players[0].active.tools.length).toBe(0);
    };
    run();
    sim.pushState(initial);
    expect(sim.getStateData()).toBe(initial); expect(sim.complete).toBe(false);
    run();
    sim.pushState(initial);
    expect(sim.getStateData()).toBe(initial); expect(sim.state.players[0].active.energies.cards.some(card => card.fullName === holons[0])).toBe(true);
    sim.cleanup();
  });
});
