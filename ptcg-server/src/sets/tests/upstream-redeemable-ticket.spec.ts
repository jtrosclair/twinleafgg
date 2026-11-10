import { TrainerCard } from '../../game/store/card/trainer-card';
import { PlayItemEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { RedeemableTicket } from '../set-journey-together/exchange-ticket';

function setupTicket() {
  const game = setupGame({ turn: 2,
    player1: { active: { card: 'Mew ex MEW' }, hand: ['Redeemable Ticket JTG'], deck: padDeck(5), prizeCount: 6 },
    player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10), prizeCount: 6 }
  });
  const ticket = game.player1.hand.cards[0] as TrainerCard;
  return { ...game, ticket };
}

describe('Redeemable Ticket JTG', () => {
  it('places shuffled prizes under the deck and draws new prizes from the top', () => {
    const game = setupTicket();
    const deck = [getCardByName('Water Energy SVE'), getCardByName('Fire Energy SVE'),
      getCardByName('Grass Energy SVE'), getCardByName('Lightning Energy SVE'), getCardByName('Psychic Energy SVE')];
    game.player1.deck.cards = [...deck];
    game.player1.prizes[1].cards = [];
    game.player1.prizes[4].cards = [];
    const prizes = game.player1.prizes.flatMap(p => p.cards);
    game.player1.prizes[2].faceUpPrize = true;
    game.player1.prizes[2].isPublic = true;
    game.player1.prizes[2].isSecret = false;
    const opponentPrizes = game.player2.prizes.map(p => p.cards[0]);
    spyOn(Math, 'random').and.returnValue(0.999);

    game.store.reduceEffect(game.state, new PlayItemEffect(game.player1, game.ticket));

    expect(game.player1.prizes.map(p => p.cards)).toEqual([[deck[0]], [deck[1]], [deck[2]], [deck[3]], [], []]);
    expect(game.player1.deck.cards).toEqual([deck[4], ...prizes]);
    expect(game.player1.prizes.filter(p => p.cards.length).every(p => p.isSecret && !p.isPublic && !p.faceUpPrize)).toBe(true);
    expect(game.player2.prizes.map(p => p.cards[0])).toEqual(opponentPrizes);
    expect(game.player1.discard.cards).toContain(game.ticket);
    expect(game.player1.hand.cards).not.toContain(game.ticket);
  });

  it('uses old prizes after the deck runs out when replacing prizes', () => {
    const game = setupTicket();
    game.player1.prizes.slice(2).forEach(p => { p.cards = []; });
    const prizes = game.player1.prizes.flatMap(p => p.cards);
    const top = getCardByName('Fire Energy SVE');
    game.player1.deck.cards = [top];
    spyOn(Math, 'random').and.returnValue(0.999);
    game.store.reduceEffect(game.state, new PlayItemEffect(game.player1, game.ticket));
    expect(game.player1.prizes.flatMap(p => p.cards)).toEqual([top, prizes[0]]);
    expect(game.player1.deck.cards).toEqual([prizes[1]]);
  });

  it('shuffles old prizes before putting them on the bottom', () => {
    const game = setupTicket();
    game.player1.prizes.slice(3).forEach(p => { p.cards = []; });
    const prizes = game.player1.prizes.flatMap(p => p.cards);
    const deck = game.player1.deck.cards.slice();
    spyOn(Math, 'random').and.returnValue(0);
    game.store.reduceEffect(game.state, new PlayItemEffect(game.player1, game.ticket));
    expect(game.player1.prizes.flatMap(p => p.cards)).toEqual(deck.slice(0, 3));
    expect(game.player1.deck.cards).toEqual([...deck.slice(3), prizes[1], prizes[2], prizes[0]]);
  });

  it('cannot be played without any remaining prizes', () => {
    const game = setupTicket();
    game.player1.prizes.forEach(p => { p.cards = []; });
    const deck = game.player1.deck.cards.slice();
    const ticket = game.ticket as RedeemableTicket;
    expect(ticket.canPlay(game.store, game.state, game.player1)).toBe(false);
    expect(() => ticket.reduceEffect(game.store, game.state, new TrainerEffect(game.player1, ticket))).toThrow();
    expect(game.player1.deck.cards).toEqual(deck);
    expect(game.player1.hand.cards).toContain(ticket);
  });
});
