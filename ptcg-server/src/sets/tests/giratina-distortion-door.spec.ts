import { setupGame, padDeck } from './test-helpers';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { PokemonCard } from '../../game/store/card/pokemon-card';

function dispatchDistortionDoor(game: any, index: number) {
  const player = game.state.players[0];
  game.store.dispatch(new UseAbilityAction(player.id, 'Distortion Door', {
    player: PlayerType.BOTTOM_PLAYER, slot: SlotType.DISCARD, index
  }));
}

describe('Giratina LOT — Distortion Door (multiple copies)', () => {
  it('activates all 4 Giratina from discard in one turn (correct indices)', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        discard: ['Giratina LOT', 'Giratina LOT', 'Giratina LOT', 'Giratina LOT'],
        deck: padDeck(10),
      },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });

    const player = game.state.players[0];
    for (let i = 0; i < 4; i++) {
      const index = player.discard.cards.findIndex(
        (c: any) => c instanceof PokemonCard && c.powers.some((p: any) => p.name === 'Distortion Door')
      );
      dispatchDistortionDoor(game, index);
    }

    expect(player.bench.filter((b: any) => b.cards.length > 0).length).toBe(4);
  });

  it('activates all 4 even when the client sends STALE discard indices', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        // A non-Giratina Pokemon precedes the Giratina, like a real discard pile.
        discard: ['Exeggcute PLF', 'Giratina LOT', 'Giratina LOT', 'Giratina LOT', 'Giratina LOT'],
        deck: padDeck(10),
      },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });

    const player = game.state.players[0];

    // Client computed these once from the original pile and never refreshed.
    // After each Giratina leaves, the pile shrinks and these point at the wrong card.
    const staleIndices = [1, 2, 3, 4];
    for (const index of staleIndices) {
      dispatchDistortionDoor(game, index);
    }

    expect(player.bench.filter((b: any) => b.cards.length > 0).length).toBe(4);
    // The non-Giratina card stays in the discard.
    expect(player.discard.cards.length).toBe(1);
  });
});
