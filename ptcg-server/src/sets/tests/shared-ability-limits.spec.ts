import { setupGame, padDeck } from './test-helpers';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase } from '../../game/store/state/state';
import { CrobatVDAA } from '../set-darkness-ablaze/other-prints';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Store } from '../../game/store/store';

function game(hand: string[], bench: { card: string, energy?: string[] }[] = []) {
  return setupGame({
    turn: 3,
    player1: { active: { card: 'Ralts SIT', damage: 40 }, bench, hand, deck: padDeck(15) },
    player2: { active: { card: 'Ralts SIT' }, deck: padDeck(15) }
  });
}
function benchCrobat(g: ReturnType<typeof game>, slot: number) {
  const index = g.player1.hand.cards.findIndex(c => c.name === 'Crobat V');
  g.store.dispatch(new PlayCardAction(g.player1.id, index, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: slot }));
}
function pyuk(g: ReturnType<typeof game>) {
  const index = g.store.state.players[0].hand.cards.findIndex(c => c.name === 'Pyukumuku');
  g.store.dispatch(new UseAbilityAction(g.player1.id, 'Pitch a Pyukumuku', { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index }));
}

describe('player-wide Ability limits', () => {
  it('allows one Crobat Dark Asset across different physical prints', () => {
    const g = game(['Crobat V DAA', 'Crobat V DAA']);
    const alt = new CrobatVDAA(); alt.id = g.player1.hand.cards[1].id;
    g.player1.hand.cards[1] = alt;
    benchCrobat(g, 0);
    expect(g.player1.hand.cards.length).toBe(6);
    const deckCount = g.player1.deck.cards.length;
    benchCrobat(g, 1);
    expect(g.player1.hand.cards.length).toBe(5);
    expect(g.player1.deck.cards.length).toBe(deckCount);
    expect(g.player1.marker.hasMarker('DARK_ASSET_MARKER')).toBe(true);
    expect(g.store.hasPrompts()).toBe(false);
  });

  it('does not consume Dark Asset when its optional prompt is declined', () => {
    const g = game(['Crobat V DAA', 'Crobat V DAA']);
    g.overridePrompt('Confirm', () => false);
    benchCrobat(g, 0);
    expect(g.player1.marker.hasMarker('DARK_ASSET_MARKER')).toBe(false);
    benchCrobat(g, 1);
    expect(g.player1.hand.cards.length).toBe(6);
    expect(g.player1.marker.hasMarker('DARK_ASSET_MARKER')).toBe(true);
  });

  it('blocks another Pyukumuku from hand after one copy is used', () => {
    const g = game(['Pyukumuku FST', 'Pyukumuku FST']);
    pyuk(g);
    const deckCount = g.player1.deck.cards.length;
    expect(() => pyuk(g)).toThrow();
    const p = g.store.state.players[0];
    expect(p.deck.cards.length).toBe(deckCount);
    expect(p.hand.cards.filter(c => c.name === 'Pyukumuku').length).toBe(1);
  });

  for (const kind of ['crobat', 'pyuk']) {
    it('retains the ' + kind + ' limit when its source enters Lost Zone and clears it only at its owner’s end turn', () => {
      const g = game(kind === 'crobat' ? ['Crobat V DAA'] : ['Pyukumuku FST']);
      if (kind === 'crobat') benchCrobat(g, 0); else pyuk(g);
      const marker = kind === 'crobat' ? 'DARK_ASSET_MARKER' : 'PYUK_MARKER';
      const source = g.player1.marker.markers.find(m => m.name === marker)!.source!;
      if (kind === 'crobat') g.player1.bench[0].moveCardTo(source, g.player1.lostzone);
      else g.player1.deck.moveCardTo(source, g.player1.lostzone);
      g.state.phase = GamePhase.FINISHED;
      const blocker = g.player2.active.getPokemonCard()!;
      const original = blocker.reduceEffect;
      blocker.reduceEffect = (_store, state, effect) => {
        if (effect instanceof EndTurnEffect) effect.preventDefault = true;
        return state;
      };
      g.store.reduceEffect(g.state, new EndTurnEffect(g.player1));
      expect(g.player1.marker.hasMarker(marker)).toBe(true);
      blocker.reduceEffect = original;
      g.store.reduceEffect(g.state, new EndTurnEffect(g.player2));
      expect(g.player1.marker.hasMarker(marker)).toBe(true);
      g.store.reduceEffect(g.state, new EndTurnEffect(g.player1));
      expect(g.player1.marker.hasMarker(marker)).toBe(false);
    });
  }

  for (const kind of ['crobat', 'pyuk']) {
    it('restores the ' + kind + ' marker source from a snapshot and clears it at its owner’s end turn', () => {
      const g = game(kind === 'crobat' ? ['Crobat V DAA'] : ['Pyukumuku FST']);
      if (kind === 'crobat') benchCrobat(g, 0); else pyuk(g);
      const marker = kind === 'crobat' ? 'DARK_ASSET_MARKER' : 'PYUK_MARKER';
      const source = g.player1.marker.markers.find(m => m.name === marker)!.source!;
      if (kind === 'crobat') g.player1.bench[0].moveCardTo(source, g.player1.lostzone);
      else g.player1.deck.moveCardTo(source, g.player1.lostzone);
      g.state.cardNames = [];
      for (const player of g.state.players) {
        for (const list of [player.active, ...player.bench, ...player.prizes, player.hand, player.deck,
          player.discard, player.lostzone, player.stadium, player.supporter]) {
          for (const card of list.cards) { card.id = g.state.cardNames.length; g.state.cardNames.push(card.fullName); }
        }
      }
      StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());
      const serializer = new StateSerializer();
      const restored = serializer.deserialize(serializer.serialize(g.state));
      const owner = restored.players[0];
      expect(owner.marker.markers.find(m => m.name === marker)!.source).toBe(owner.lostzone.cards[0]);
      const store = new Store({ onStateChange() {} });
      store.restoreState(restored);
      restored.phase = GamePhase.FINISHED;
      store.reduceEffect(restored, new EndTurnEffect(owner));
      expect(owner.marker.hasMarker(marker)).toBe(false);
      store.cleanup();
    });
  }

  it('allows two Munkidori to use Adrena-Brain independently in one turn', () => {
    const g = game([], [
      { card: 'Munkidori TWM', energy: ['Darkness Energy SVE'] },
      { card: 'Munkidori TWM', energy: ['Darkness Energy SVE'] }
    ]);
    const transfer = [{ from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 } }];
    for (let index = 0; index < 2; index++) {
      g.overridePrompt('Remove damage', () => transfer);
      g.store.dispatch(new UseAbilityAction(g.player1.id, 'Adrena-Brain', { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index }));
    }
    expect(g.player1.active.damage).toBe(20);
    expect(g.player2.active.damage).toBe(20);
    expect(g.player1.marker.markers.filter(m => m.name === 'ADRENA_BRAIN_MARKER').length).toBe(2);
  });
});
