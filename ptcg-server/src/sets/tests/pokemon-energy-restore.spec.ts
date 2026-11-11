import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { State } from '../../game/store/state/state';
import { Card } from '../../game/store/card/card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { SuperType } from '../../game/store/card/card-types';
import { UseAbilityAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { CardsToHandEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';

const prints = [
  { name: "Holon's Magnemite DS", symbols: 1 }, { name: "Holon's Voltorb DS", symbols: 1 },
  { name: "Holon's Magneton DS", symbols: 2 }, { name: "Holon's Electrode DS", symbols: 2 },
  { name: "Holon's Castform HP", symbols: 2 }, { name: 'Charjabug UNB', symbols: 2 }
];
function game(name: string, copied = false) {
  const g = setupGame({ turn: 2,
    player1: { active: { card: 'Vikavolt SUM', energy: ['Fire Energy SVE', 'Fire Energy SVE'] }, hand: [name, name], deck: padDeck(10) },
    player2: { active: { card: copied ? 'Mew ex 30C' : 'Primeape STS', energy: ['Fire Energy SVE'] }, bench: copied ? [{ card: 'Primeape STS' }] : [], deck: padDeck(10) }
  });
  g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
  return g;
}
function attach(g: ReturnType<typeof setupGame>, card: Card) {
  const player = g.store.state.players[0];
  g.store.dispatch(new UseAbilityAction(player.id, card.powers[0].name,
    { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: player.hand.cards.indexOf(card) }));
}
function serialize(state: State) {
  const all: Card[] = [];
  for (const player of state.players) {
    for (const list of [player.active, ...player.bench, player.deck, player.hand, player.discard,
      player.lostzone, player.stadium, player.supporter, ...player.prizes]) {
      for (const card of list.cards) { if (!all.includes(card)) { all.push(card); } }
    }
  }
  all.forEach((card, index) => card.id = index);
  state.cardNames = all.map(card => card.fullName);
  StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());
  return new StateSerializer().serialize(state);
}
function roundtrip(g: ReturnType<typeof setupGame>) {
  const serialized = serialize(g.store.state);
  const state = new StateSerializer().deserialize(serialized);
  g.store.restoreState(state);
  return state;
}
function nextOwnTurn(g: ReturnType<typeof setupGame>) {
  for (let turn = 0; turn < 2; turn++) {
    const state = g.store.state;
    g.store.dispatch(new PassTurnAction(state.players[state.activePlayer].id));
  }
}
function baseAttack(state: State) {
  return new AttackEffect(state.players[1], state.players[0], state.players[1].active.getPokemonCard()!.attacks[0]);
}

describe('Pokemon-as-Energy restoration and existing live lifecycle', () => {
  for (const entry of prints) {
    it('real hand attachment and restoration preserve form, symbols and aliases: ' + entry.name, () => {
      const g = game(entry.name), physical = g.player1.hand.cards[0], separate = g.player1.hand.cards[1];
      attach(g, physical);
      expect(physical.superType).toBe(SuperType.ENERGY);
      expect(separate.superType).toBe(SuperType.POKEMON);
      const state = roundtrip(g), slot = state.players[0].active;
      const restored = slot.energies.cards.find(card => card.id === physical.id)!;
      expect(restored).toBeDefined(); expect(slot.cards).toContain(restored);
      expect(restored.superType).toBe(SuperType.ENERGY);
      expect(state.players[0].hand.cards.find(card => card.id === separate.id)!.superType).toBe(SuperType.POKEMON);
      const energy = new CheckProvidedEnergyEffect(state.players[0], slot);
      g.store.reduceEffect(state, energy);
      expect(energy.energyMap.find(item => item.card === restored)!.provides.length).toBe(entry.symbols);
      expect(CardManager.getInstance().getAllCards().find(card => card.fullName === entry.name)!.superType).toBe(SuperType.POKEMON);
    });
    it('discard/hand return and reattachment use the same physical card: ' + entry.name, () => {
      const g = game(entry.name), physical = g.player1.hand.cards[0]; attach(g, physical);
      const state = roundtrip(g), player = state.players[0];
      const card = player.active.energies.cards.find(item => item.id === physical.id)!;
      const back = new CardsToHandEffect(baseAttack(state), [card]); back.target = player.active;
      g.store.reduceEffect(state, back);
      expect(player.hand.cards.filter(item => item === card).length).toBe(1);
      expect(player.active.energies.cards).not.toContain(card);
      nextOwnTurn(g);
      expect(card.superType).toBe(SuperType.POKEMON);
      attach(g, card);
      expect(player.active.cards).toContain(card); expect(player.active.energies.cards).toContain(card);
      expect(card.superType).toBe(SuperType.ENERGY);
      const discard = new DiscardCardsEffect(baseAttack(g.store.state), [card]); discard.target = player.active;
      g.store.reduceEffect(g.store.state, discard);
      // Existing live reducers reconcile a discarded card on their next effect.
      g.store.reduceEffect(g.store.state, new CheckProvidedEnergyEffect(player, player.active));
      expect(card.superType).toBe(SuperType.POKEMON);
      expect(player.discard.cards.filter(item => item === card).length).toBe(1);
      expect(player.active.energies.cards).not.toContain(card);
    });
    for (const copied of [false, true]) {
      it('Swagger selects and discards a restored attachment, copied=' + copied + ': ' + entry.name, () => {
        spyOn(Math, 'random').and.returnValue(0.1);
        const g = game(entry.name, copied), physical = g.player1.hand.cards[0]; attach(g, physical);
        const state = roundtrip(g), restored = state.players[0].active.energies.cards.find(card => card.id === physical.id)!;
        g.overridePrompt('Choose cards', (prompt: any) => [prompt.cards.cards.indexOf(restored)]);
        g.store.dispatch(new PassTurnAction(state.players[0].id));
        if (copied) {
          g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Swagger' }));
          useAbility(g.store, state, 1, 'Memory Helix');
        } else { useAttack(g.store, state, 1, 'Swagger'); }
        expect(state.players[0].discard.cards).toContain(restored);
        expect(state.players[0].active.energies.cards).not.toContain(restored);
        expect(restored.superType).toBe(SuperType.POKEMON);
      });
    }
  }
  it('same-print copies and separately restored games never share mutable form or arrays', () => {
    const g = game(prints[0].name), card = g.player1.hand.cards[0]; attach(g, card);
    const serialized = serialize(g.state), serializer = new StateSerializer();
    const a = serializer.deserialize(serialized), b = serializer.deserialize(serialized);
    const attachedA = a.players[0].active.energies.cards.find(item => item.id === card.id)!;
    const attachedB = b.players[0].active.energies.cards.find(item => item.id === card.id)!;
    const hand = a.players[0].hand.cards.find(item => item.fullName === card.fullName)!;
    expect(attachedA).not.toBe(attachedB); expect(attachedA).not.toBe(hand);
    expect(attachedA.superType).toBe(SuperType.ENERGY); expect(hand.superType).toBe(SuperType.POKEMON);
    (attachedA as any).provides.push(999); attachedA.superType = SuperType.POKEMON;
    expect((attachedB as any).provides).not.toContain(999); expect(attachedB.superType).toBe(SuperType.ENERGY);
    expect(getCardByName(card.fullName).superType).toBe(SuperType.POKEMON);
  });
  for (const entry of [prints[0], prints[2], prints[5]]) {
    it('keeps two real attached copies independent through restoration/discard: ' + entry.name, () => {
      const g = game(entry.name), first = g.player1.hand.cards[0], second = g.player1.hand.cards[1];
      attach(g, first); nextOwnTurn(g); attach(g, second);
      const state = roundtrip(g), slot = state.players[0].active;
      const a = slot.energies.cards.find(card => card.id === first.id)!;
      const b = slot.energies.cards.find(card => card.id === second.id)!;
      expect(a).not.toBe(b); expect(a.superType).toBe(SuperType.ENERGY); expect(b.superType).toBe(SuperType.ENERGY);
      const discard = new DiscardCardsEffect(baseAttack(state), [a]); discard.target = slot;
      g.store.reduceEffect(state, discard);
      g.store.reduceEffect(state, new CheckProvidedEnergyEffect(state.players[0], slot));
      expect(a.superType).toBe(SuperType.POKEMON); expect(b.superType).toBe(SuperType.ENERGY);
      expect(slot.energies.cards).not.toContain(a); expect(slot.energies.cards).toContain(b);
    });
  }
  it('preserves attached form when an Energy is transferred to another Pokemon', () => {
    const g = game(prints[0].name), card = g.player1.hand.cards[0]; attach(g, card);
    const state = roundtrip(g), player = state.players[0], restored = player.active.energies.cards.find(item => item.id === card.id)!;
    player.bench[0].cards.push(getCardByName('Pikachu BS'));
    player.active.moveCardTo(restored, player.bench[0]);
    expect(player.active.cards).not.toContain(restored); expect(player.active.energies.cards).not.toContain(restored);
    expect(player.bench[0].cards).toContain(restored); expect(player.bench[0].energies.cards).toContain(restored);
    expect(restored.superType).toBe(SuperType.ENERGY);
  });
  it('does not infer form for ordinary Pokemon or ambiguous same-ID placements', () => {
    const g = game(prints[0].name), card = g.player1.hand.cards[0]; attach(g, card);
    g.player1.hand.cards.push(card); // malformed same physical card in two zones
    const ordinary = getCardByName('Pikachu BS');
    g.player1.active.cards.push(ordinary); g.player1.active.energies.cards.push(ordinary);
    const state = new StateSerializer().deserialize(serialize(g.state));
    expect(state.players[0].hand.cards.find(item => item.id === card.id)!.superType).toBe(SuperType.POKEMON);
    expect(state.players[0].active.energies.cards.find(item => item.id === ordinary.id)!.superType).toBe(SuperType.POKEMON);
  });
  it('does not infer an attachment when a mirrored Pokemon has no distinct holder', () => {
    const g = game(prints[0].name), card = g.player1.hand.cards.shift()!;
    g.player1.active.cards = [card]; g.player1.active.energies.cards = [card];
    const state = new StateSerializer().deserialize(serialize(g.state));
    expect(state.players[0].active.cards[0].superType).toBe(SuperType.POKEMON);
    expect(state.players[0].active.energies.cards[0]).toBe(state.players[0].active.cards[0]);
  });
  it('does not add a deserialization exception for malformed tools metadata', () => {
    const g = game(prints[0].name), card = g.player1.hand.cards[0]; attach(g, card);
    (g.player1.active as any).tools = { legacy: true };
    let restored: State | undefined;
    expect(() => restored = new StateSerializer().deserialize(serialize(g.state))).not.toThrow();
    expect((restored!.players[0].active as any).tools).toEqual({ legacy: true });
    expect(restored!.players[0].active.energies.cards.find(item => item.id === card.id)!.superType).toBe(SuperType.POKEMON);
  });
  it('does not invent a legacy Buzzap Energy choice', () => {
    const g = game(prints[0].name), electrode = getCardByName('Electrode BS');
    electrode.superType = SuperType.ENERGY; (electrode as any).chosenEnergyType = 7; (electrode as any).provides = [7, 7];
    g.player1.active.cards.push(electrode); g.player1.active.energies.cards.push(electrode);
    const state = new StateSerializer().deserialize(serialize(g.state));
    const restored = state.players[0].active.energies.cards.find(item => item.id === electrode.id)!;
    expect((restored as any).chosenEnergyType).toBeUndefined(); expect((restored as any).provides).toEqual([]);
    expect(restored.superType).toBe(SuperType.POKEMON);
  });
  it('keeps marker references and canonical wire bytes stable across repeated restoration', () => {
    const g = game(prints[0].name), card = g.player1.hand.cards[0]; attach(g, card);
    g.player1.active.marker.addMarker('ATTACHMENT_IDENTITY_TEST', card);
    const serializer = new StateSerializer(), wire = serialize(g.state), state = serializer.deserialize(wire);
    const restored = state.players[0].active.energies.cards.find(item => item.id === card.id)!;
    expect(state.players[0].active.marker.markers[0].source).toBe(restored);
    expect(serializer.serialize(state)).toBe(wire);
    expect(serializer.serialize(serializer.deserialize(wire))).toBe(wire);
  });
});
