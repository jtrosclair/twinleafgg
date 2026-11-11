import { padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
import { Card } from '../../game/store/card/card';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameMessage } from '../../game/game-message';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

function game(copied: boolean, tool = false) {
  const fire = 'Fire Energy SVE';
  const g = setupGame({ turn: 5,
    player1: { active: { card: copied ? 'Mew ex 30C' : 'Meowth ex POR', energy: [fire, fire, fire], tools: tool ? ['Bravery Charm PAL'] : [] },
      bench: copied ? [{ card: 'Meowth ex POR' }, { card: 'Charmander BS' }] : [{ card: 'Charmander BS' }],
      hand: ["Holon's Magnemite DS"], deck: padDeck(12) },
    player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(12) }
  });
  const holon = g.player1.hand.cards[0];
  g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
  g.store.dispatch(new UseAbilityAction(g.player1.id, holon.powers[0].name,
    { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 }));
  const source = g.player1.active, attacker = source.getPokemonCard()!, promotion = g.player1.bench[copied ? 1 : 0];
  const run = () => {
    g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: copied ? 1 : 0 }]);
    if (copied) {
      g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Tuck Tail' }));
      useAbility(g.store, g.state, 0, 'Memory Helix');
    } else useAttack(g.store, g.state, 0, 'Tuck Tail');
  };
  return { ...g, source, attacker, holon, promotion, run };
}

describe('Meowth Tuck Tail movement interception compatibility', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  for (const copied of [false, true]) {
    it('a prevented attachment MoveCardsEffect retains aliases until existing stack cleanup, copied=' + copied, () => {
      const g = game(copied), reduce = g.store.reduceEffect.bind(g.store);
      const energies = [...g.source.energies.cards]; let blocked = false;
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (!blocked && effect instanceof MoveCardsEffect && effect.source === g.source && effect.destination === g.player1.hand) {
          blocked = true; effect.preventDefault = true;
          const result = reduce(state, effect);
          for (const card of energies) {
            expect(g.source.cards).toContain(card); expect(g.source.energies.cards).toContain(card);
          }
          return result;
        }
        return reduce(state, effect);
      });
      g.run();
      expect(blocked).toBe(true); expect(g.player1.hand.cards).toContain(g.attacker);
      expect(g.player1.active).toBe(g.promotion);
      // Existing MoveCardsEffect cleanup discards attachments left after the
      // Pokemon stack leaves. This test does not claim atomic cancellation.
      for (const card of energies) {
        expect(g.player1.hand.cards).not.toContain(card); expect(g.player1.discard.cards).toContain(card);
      }
    });

    it('a redirected attachment move keeps its actual destination and clears the physical mirror, copied=' + copied, () => {
      const g = game(copied), reduce = g.store.reduceEffect.bind(g.store); let redirected = false;
      const energies = [...g.source.energies.cards];
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (!redirected && effect instanceof MoveCardsEffect && effect.source === g.source && effect.destination === g.player1.hand) {
          redirected = true; effect.destination = g.player1.lostzone;
        }
        return reduce(state, effect);
      });
      g.run();
      expect(redirected).toBe(true); expect(g.player1.hand.cards).toContain(g.attacker);
      for (const card of energies) {
        expect(g.player1.lostzone.cards.filter(item => item === card).length).toBe(1);
        expect(g.player1.hand.cards).not.toContain(card); expect(g.source.energies.cards).not.toContain(card);
      }
    });

    for (const redirected of [false, true]) it('does not erase a Tool alias when its direct movement was prevented/redirected, redirected=' + redirected + ', copied=' + copied, () => {
      const g = game(copied, true), tool = g.source.tools[0], move = g.source.moveCardTo.bind(g.source);
      let intercepted = false;
      spyOn(g.source, 'moveCardTo').and.callFake((card: Card, destination: CardList) => {
        if (card === tool && destination === g.player1.hand) {
          intercepted = true;
          if (redirected) move(card, g.player1.discard);
          expect(g.source.tools).toContain(tool);
          return;
        }
        move(card, destination);
      });
      g.run();
      expect(intercepted).toBe(true); expect(g.player1.hand.cards).not.toContain(tool);
      expect(g.player1.discard.cards).toContain(tool);
      expect(g.source.tools).toContain(tool); // existing alias semantics when not returned to hand
      expect(g.player1.hand.cards).toContain(g.attacker); expect(g.player1.active).toBe(g.promotion);
    });

    for (const redirected of [false, true]) it('does not mistake an existing hand alias for a successful Tool return, redirected=' + redirected + ', copied=' + copied, () => {
      const g = game(copied, true), tool = g.source.tools[0], move = g.source.moveCardTo.bind(g.source);
      g.player1.hand.cards.push(tool); // ambiguous legacy same-physical-card placement
      spyOn(g.source, 'moveCardTo').and.callFake((card: Card, destination: CardList) => {
        if (card === tool && destination === g.player1.hand) {
          if (redirected) move(card, g.player1.discard);
          return;
        }
        move(card, destination);
      });
      g.run();
      expect(g.player1.hand.cards.filter(card => card === tool).length).toBe(1);
      expect(g.source.tools).toContain(tool);
      expect(g.player1.hand.cards).toContain(g.attacker); expect(g.player1.active).toBe(g.promotion);
    });

    it('a nested switch during the first move cannot redirect later groups to the replacement, copied=' + copied, () => {
      const g = game(copied, true), reduce = g.store.reduceEffect.bind(g.store);
      const returned = [...g.source.cards], replacement = g.promotion.getPokemonCard()!; let switched = false;
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        const result = reduce(state, effect);
        if (!switched && effect instanceof MoveCardsEffect && effect.source === g.source && effect.destination === g.player1.hand) {
          switched = true; g.player1.switchPokemon(g.promotion, g.store, state);
        }
        return result;
      });
      g.run();
      expect(switched).toBe(true); expect(g.player1.active.getPokemonCard()).toBe(replacement);
      expect(g.player1.hand.cards).not.toContain(replacement);
      for (const card of returned) expect(g.player1.hand.cards.filter(item => item === card).length).toBe(1);
      expect(g.source.cards.length).toBe(0); expect(g.source.energies.cards.length).toBe(0); expect(g.source.tools.length).toBe(0);
    });

    it('a queued prompt callback after a nested move cannot cause a second return from the replacement, copied=' + copied, () => {
      const g = game(copied, true), reduce = g.store.reduceEffect.bind(g.store);
      const returned = [...g.source.cards], replacement = g.promotion.getPokemonCard()!; let queued = false, resolved = false;
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        const result = reduce(state, effect);
        if (!queued && effect instanceof MoveCardsEffect && effect.source === g.source && effect.destination === g.player1.hand) {
          queued = true;
          g.store.prompt(state, new ConfirmPrompt(g.player1.id, GameMessage.WANT_TO_SWITCH_POKEMON), () => {
            resolved = true; g.player1.switchPokemon(g.promotion, g.store, state);
          });
        }
        return result;
      });
      g.run();
      expect(queued).toBe(true); expect(resolved).toBe(true);
      expect(g.player1.active.getPokemonCard()).toBe(replacement); expect(g.player1.hand.cards).not.toContain(replacement);
      for (const card of returned) expect(g.player1.hand.cards.filter(item => item === card).length).toBe(1);
    });
  }
});
