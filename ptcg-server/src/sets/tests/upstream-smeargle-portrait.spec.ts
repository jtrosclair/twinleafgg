import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Base64 } from '../../utils/base64';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { GamePhase } from '../../game/store/state/state';
import { endTurn, playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const smeargle = 'Smeargle UD';
const tierno = 'Tierno PHF';
const surge = "Lt. Surge's Strategy UNB";
const engineer = "Engineer's Adjustments UL";
const misty = "Misty's Cheerfulness M5";

function battle(opponentHand: string[], options: {
  hand?: string[]; bench?: string; opposingKrookodile?: boolean; prizeCount?: number;
} = {}) {
  return setupGame({
    turn: 5,
    player1: {
      active: { card: smeargle }, bench: options.bench ? [{ card: options.bench }] : [],
      hand: options.hand ?? [tierno, tierno], deck: padDeck(20)
    },
    player2: {
      active: options.opposingKrookodile
        ? { card: 'Krookodile XY', energy: ['Darkness Energy SVE', 'Water Energy SVE', 'Water Energy SVE'] }
        : { card: 'Dhelmise M5' },
      hand: opponentHand, deck: padDeck(12), prizeCount: options.prizeCount ?? 6
    }
  });
}

function portrait(game: ReturnType<typeof battle>) {
  useAbility(game.store, game.store.state, 0, 'Portrait');
}

function play(game: ReturnType<typeof battle>, name = tierno) {
  playTrainerCard(game.store, game.store.state, 0, name);
}

describe('Smeargle UD Portrait', () => {
  for (const playedFirst of [false, true]) {
    it(`copies Tierno ${playedFirst ? 'after' : 'before'} playing a Supporter from hand`, () => {
      const game = battle([tierno]);
      const original = game.player2.hand.cards[0];
      if (playedFirst) play(game);
      const size = game.player1.hand.cards.length;
      portrait(game);
      expect(game.player1.hand.cards.length).toBe(size + 3);
      expect(game.player2.hand.cards).toEqual([original]);
      expect(game.player1.supportersPlayedThisTurn ?? 0).toBe(playedFirst ? 1 : 0);
      if (!playedFirst) play(game);
      expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
    });
  }

  it('respects Bother for a real Supporter but still copies Tierno', () => {
    spyOn(Math, 'random').and.returnValue(0);
    const game = battle([tierno], { opposingKrookodile: true });
    endTurn(game.store, game.state);
    useAttack(game.store, game.state, 1, 'Bother');
    expect(() => play(game)).toThrow();
    const hand = game.store.state.players[0].hand.cards.length;
    portrait(game);
    expect(game.store.state.players[0].hand.cards.length).toBe(hand + 3);
  });

  it('does not count copied Bea for Hitmontop’s Tornado Kick', () => {
    const game = battle(['Bea VIV'], { bench: 'Hitmontop VIV' });
    const hitmontop = game.player1.bench[0].getPokemonCard()!;
    const before = game.player1.deck.cards.length;
    portrait(game);
    expect(game.player1.deck.cards.length).toBe(before - 5);
    expect(game.player1.marker.hasMarker('HITMONTOP_VIV_BEA_PLAYED_MARKER', hitmontop)).toBe(false);
    expect(game.player2.hand.cards[0].fullName).toBe('Bea VIV');
  });

  for (const playedFirst of [false, true]) {
    it(`keeps Lt. Surge’s three-Supporter limit with ${playedFirst ? 'one earlier play' : 'no earlier plays'}`, () => {
      const game = battle([surge], { hand: Array(4).fill(tierno), prizeCount: 4 });
      if (playedFirst) play(game);
      portrait(game);
      expect(game.player2.hand.cards[0].fullName).toBe(surge);
      for (let played = playedFirst ? 1 : 0; played < 3; played++) play(game);
      expect(game.player1.supportersPlayedThisTurn).toBe(3);
      expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
    });
  }

  it('requires selection when a Supporter is present and resolves an unmet discard cost without an error', () => {
    const game = battle([engineer], { hand: [] });
    const before = game.player1.deck.cards.length;
    game.overridePrompt('Choose cards', prompt => {
      expect((prompt as ChooseCardsPrompt).options.allowCancel).toBe(false);
      return [0];
    });
    portrait(game);
    expect(game.player1.deck.cards.length).toBe(before);
    expect(game.player2.hand.cards.map(c => c.fullName)).toEqual([engineer]);
    expect(() => portrait(game)).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
  });

  it('pays Engineer’s discard cost and draws four after a real Supporter play', () => {
    const game = battle([engineer], { hand: [tierno, 'Fire Energy SVE'] });
    play(game);
    const size = game.player1.hand.cards.length;
    portrait(game);
    expect(game.player1.hand.cards.length).toBe(size + 3);
    expect(game.player1.discard.cards.some(card => card.fullName === 'Fire Energy SVE')).toBe(true);
    expect(game.player1.supportersPlayedThisTurn).toBe(1);
  });

  it('reveals a nonempty opponent hand even if it has no Supporter', () => {
    const game = battle(['Water Energy SVE']);
    let revealed: string[] = [];
    game.overridePrompt('Show cards', prompt => {
      revealed = (prompt as ShowCardsPrompt).cards.map(card => card.fullName);
      return true;
    });
    portrait(game);
    expect(revealed).toEqual(['Water Energy SVE']);
    expect(game.player2.hand.cards.length).toBe(1);
  });

  it('resolves copied Misty’s Energy prompts and applies its printed turn end', () => {
    const game = battle([misty]);
    portrait(game);
    expect(game.player1.active.energies.cards.length).toBe(4);
    expect(game.player1.supportersPlayedThisTurn).toBeUndefined();
    expect(game.state.activePlayer).toBe(1);
    expect(game.state.phase).toBe(GamePhase.PLAYER_TURN);
  });

  it('resolves Portrait on a saved snapshot and restores the previous Supporter count on undo', () => {
    const game = battle([tierno], { hand: [tierno] });
    ensureClientCards();
    for (const player of game.state.players) {
      const zones = [player.active, ...player.bench, player.hand, player.deck, ...player.prizes];
      for (const zone of zones) {
        for (const card of zone.cards) {
          card.id = game.state.cardNames.length;
          game.state.cardNames.push(card.fullName);
        }
      }
    }

    const sim = new ClientSimulator();
    try {
      const stateData = new Base64().encode(new StateSerializer().serialize(game.state));
      sim.loadSnapshot({ stateData });
      const target = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
      sim.dispatch(new PlayCardAction(sim.humanPlayerId, 0, { ...target, slot: SlotType.BOARD }));
      sim.dispatch(new UseAbilityAction(sim.humanPlayerId, 'Portrait', target));
      const prompt = sim.state.prompts.find(entry => entry instanceof ChooseCardsPrompt && entry.result === undefined);
      expect(prompt).toBeDefined();
      sim.resolvePrompt(prompt!.id, [0]);
      expect(sim.state.players[0].hand.cards.length).toBe(6);
      expect(sim.state.players[1].hand.cards.map(card => card.fullName)).toEqual([tierno]);
      expect(sim.state.players[0].supportersPlayedThisTurn).toBe(1);

      expect(sim.undo()).toBe(true);
      expect(sim.state.players[0].hand.cards.length).toBe(3);
      expect(sim.state.players[0].supportersPlayedThisTurn).toBe(1);
    } finally {
      sim.cleanup();
    }
  });
});
