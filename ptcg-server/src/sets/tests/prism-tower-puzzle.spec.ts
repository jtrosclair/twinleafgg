import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { UseStadiumAction } from '../../game/store/actions/game-actions';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

describe('Prism Tower in Hide ‘n’ Sneak Attack', () => {
  it('registers every existing Prism Tower identity as a Stadium', () => {
    const cards = ensureClientCards();
    for (const name of ['Prism Tower M4', 'Prism Tower M4 80', 'Prism Tower FA CRI']) {
      const card = cards.find(card => card.fullName === name) as TrainerCard;
      expect(card).toBeDefined();
      expect(card.trainerType).toBe(TrainerType.STADIUM);
    }
  });

  it('replaces Risky Ruins, discards two cards and draws one in the actual puzzle snapshot', () => {
    const sim = new ClientSimulator();
    const fixture = path.resolve(__dirname, '../../../../tools/fixtures/hide-n-sneak-attack.snapshot.json.gz');
    sim.loadSnapshot({ stateData: zlib.gunzipSync(fs.readFileSync(fixture)).toString('base64') });
    const player = sim.state.players[0];
    const tower = player.hand.cards.find(card => card.fullName === 'Prism Tower M4 80')!;
    const oldStadium = player.stadium.cards[0];
    expect(oldStadium.fullName).toBe('Risky Ruins MEG');
    sim.dispatch(new PlayCardAction(sim.humanPlayerId, player.hand.cards.indexOf(tower),
      { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
    expect(player.stadium.cards).toEqual([tower]);
    expect(player.discard.cards).toContain(oldStadium);
    expect(player.discard.cards).not.toContain(tower);
    expect(player.stadiumPlayedTurn).toBe(sim.state.turn);

    const handCount = player.hand.cards.length;
    const deckCount = player.deck.cards.length;
    const topCard = player.deck.cards[0];
    const discard = ['Poltchageist M5', 'Shuppet M5'].map(name => player.hand.cards.find(card => card.fullName === name)!);
    const unusedTurn = player.stadiumUsedTurn;
    sim.dispatch(new UseStadiumAction(sim.humanPlayerId));
    const cancelled = sim.state.prompts.find(prompt => prompt.result === undefined && prompt.type === 'Choose cards')!;
    sim.resolvePrompt(cancelled.id, null);
    expect(player.hand.cards.length).toBe(handCount);
    expect(player.deck.cards.length).toBe(deckCount);
    expect(player.stadiumUsedTurn).toBe(unusedTurn);

    sim.dispatch(new UseStadiumAction(sim.humanPlayerId));
    const prompt = sim.state.prompts.find(prompt => prompt.result === undefined && prompt.type === 'Choose cards')!;
    expect(prompt).toBeDefined();
    sim.resolvePrompt(prompt.id, discard.map(card => player.hand.cards.indexOf(card)));
    for (const card of discard) expect(player.discard.cards).toContain(card);
    expect(player.deck.cards.length).toBe(deckCount - 1);
    expect(player.hand.cards.length).toBe(handCount - 1);
    expect(player.hand.cards).toContain(topCard);
    expect(player.stadiumUsedTurn).toBe(sim.state.turn);
    expect(() => sim.dispatch(new UseStadiumAction(sim.humanPlayerId))).toThrow();
  });
});
