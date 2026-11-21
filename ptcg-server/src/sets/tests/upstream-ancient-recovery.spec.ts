import { ensureClientCards } from '../../client/cards';
import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { padDeck, setupGame, SetupGameResult } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const water = 'Water Energy SVE';
const rainbow = 'Rainbow Energy SUM';
const jet = 'Jet Energy PAL';
const scarf = 'Healing Scarf ROS';
const dyna = 'Dyna Tree Hill CRE';
const frozen = 'Frozen City PLF';
const other = 'Finneon MT';
const recovery = ['Ludicolo PRC 37', 'Eelektrik PRC 64', 'Tentacool PRC 71', 'Azumarill PRC 104', 'Bidoof PRC 117'];

function playEnergy(game: SetupGameResult, to = active) {
  game.store.dispatch(new PlayCardAction(game.player1.id, 0, to));
}

describe('α Recovery and completed hand attachments', () => {
  beforeAll(ensureClientCards);
  let game: SetupGameResult | undefined;
  afterEach(() => game?.store.cleanup());

  for (const card of recovery) {
    it(`${card} doubles Healing Scarf while leaving the Energy attached`, () => {
      game = setupGame({ turn: 5,
        player1: { active: { card, damage: 50, tools: [scarf] }, hand: [water], deck: padDeck(5) },
        player2: { active: { card: other }, deck: padDeck(5) }
      });
      const { player1 } = game;
      const energy = player1.hand.cards[0];
      expect(player1.active.getPokemonCard()?.powers).toContain(jasmine.objectContaining({
        name: 'α Recovery', powerType: PowerType.ANCIENT_TRAIT
      }));
      playEnergy(game);
      expect(player1.active.damage).toBe(10);
      expect(player1.active.cards).toContain(energy);
      expect(player1.active.energies.cards).toContain(energy);
    });
  }

  it('does not give the trait to the neighboring regular Ludicolo print', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: 'Ludicolo PRC', damage: 50, tools: [scarf] }, hand: [water], deck: padDeck(5) },
      player2: { active: { card: other }, deck: padDeck(5) }
    });
    playEnergy(game);
    expect(game.player1.active.damage).toBe(30);
  });

  it('heals Bidoof to full through the official Breath of the Leaves interaction', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: 'Leafeon-GX UPR' }, bench: [{ card: 'Bidoof PRC 117', damage: 60, energy: [water] }], deck: padDeck(5) },
      player2: { active: { card: other }, deck: padDeck(5) }
    });
    game.overridePrompt('Choose pokemon', () => [bench]);
    game.store.dispatch(new UseAbilityAction(game.player1.id, 'Breath of the Leaves', active));
    expect(game.player1.bench[0].damage).toBe(0);
  });

  it('lets the Stadium block only healing, even during an attack', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: 'Audino EPO', energy: [water, water, water], damage: 30 },
        bench: [{ card: 'Ludicolo PRC 37', damage: 50, tools: [scarf] }], hand: [water], deck: padDeck(5) },
      player2: { active: { card: other, damage: 10 }, hand: [dyna], deck: padDeck(5) }
    });
    const { player1, player2, store, state } = game;
    player2.hand.moveCardTo(player2.hand.cards[0], player2.stadium);
    playEnergy(game, bench);
    expect(player1.bench[0].energies.cards.length).toBe(1);
    expect(player1.bench[0].damage).toBe(50);
    store.reduceEffect(state, new HealEffect(player2, player2.active, 20));
    expect(player2.active.damage).toBe(10);
    expect(state.activePlayer).toBe(0);
    game.overridePrompt('Choose pokemon', () => [bench]);
    store.dispatch(new AttackAction(player1.id, 'Heal Pulse'));
    expect(player1.bench[0].damage).toBe(50);
    expect(state.activePlayer).toBe(1);
  });

  it('also heals once through a Healing Scarf stored only in the legacy Tools list', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: 'Ludicolo PRC 37', damage: 50, tools: [scarf] }, hand: [water], deck: padDeck(5) },
      player2: { active: { card: other }, deck: padDeck(5) }
    });
    const target = game.player1.active;
    target.cards = target.cards.filter(card => !target.tools.includes(card));
    playEnergy(game);
    expect(target.damage).toBe(10);
  });

  for (const protect of [true, false]) {
    it(`Dyna Tree Hill honors New Moon for the healed Pokémon's owner (${protect})`, () => {
      const partners = [{ card: 'Lunatone OBF' }, { card: 'Solrock PGO' }];
      game = setupGame({ turn: 5,
        player1: { active: { card: 'Ludicolo PRC 37', damage: 60, tools: [scarf] }, bench: protect ? partners : [], hand: [water], deck: padDeck(5) },
        player2: { active: { card: other }, bench: protect ? [] : partners, hand: [dyna], deck: padDeck(5) }
      });
      game.player2.hand.moveCardTo(game.player2.hand.cards[0], game.player2.stadium);
      playEnergy(game);
      expect(game.player1.active.damage).toBe(protect ? 20 : 60);
    });
  }

  it('checks Sitrus Berry on turn end and doubles its 30 heal', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: 'Ludicolo PRC 37', damage: 80, tools: ['Sitrus Berry SSH'] }, deck: padDeck(5) },
      player2: { active: { card: other }, deck: padDeck(5) }
    });
    game.store.dispatch(new PassTurnAction(game.player1.id));
    expect(game.player1.active.damage).toBe(20);
    expect(game.player1.discard.cards.map(card => card.fullName)).toContain('Sitrus Berry SSH');
  });

  it('uses the healing pipeline for Milotic on a mixed Bench', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: 'Milotic DAA' }, bench: [{ card: 'Ludicolo PRC 37', damage: 50 }, { card: 'Ludicolo PRC', damage: 50 }], deck: padDeck(5) },
      player2: { active: { card: other }, deck: padDeck(5) }
    });
    game.store.dispatch(new UseAbilityAction(game.player1.id, 'Bright Heal', active));
    expect(game.player1.bench.slice(0, 2).map(slot => slot.damage)).toEqual([10, 30]);
  });

  it('heals through Moomoo Malt after a hand attachment', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: 'Miltank CIN' }, bench: [{ card: 'Primal Kyogre-EX PRC', damage: 200 }], hand: [water], deck: padDeck(5) },
      player2: { active: { card: other }, deck: padDeck(5) }
    });
    playEnergy(game, bench);
    expect(game.player1.bench[0].damage).toBe(110);
  });

  for (const origin of ['deck', 'discard'] as const) {
    for (const card of [rainbow, jet]) {
      it(`${card} keeps its hand-only effect and healing triggers inactive from ${origin}`, () => {
        game = setupGame({ turn: 5,
          player1: { active: { card: 'Miltank CIN' }, bench: [{ card: 'Primal Kyogre-EX PRC', damage: 180, tools: [scarf] }], [origin]: [card] },
          player2: { active: { card: other }, hand: [frozen], deck: padDeck(5) }
        });
        const { store, state, player1, player2 } = game;
        player2.hand.moveCardTo(player2.hand.cards[0], player2.stadium);
        const energy = player1[origin].cards[0] as EnergyCard;
        store.reduceEffect(state, new AttachEnergyEffect(player1, energy, player1.bench[0], origin));
        expect(player1.bench[0].cards).toContain(energy);
        expect(player1.bench[0].damage).toBe(180);
        expect(player1.active.getPokemonCard()?.fullName).toBe('Miltank CIN');
      });
    }
  }

  it('applies Frozen City and Rainbow Energy to the successful manual attachment', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: 'Primal Kyogre-EX PRC', damage: 30 }, hand: [rainbow], deck: padDeck(5) },
      player2: { active: { card: other }, hand: [frozen], deck: padDeck(5) }
    });
    game.player2.hand.moveCardTo(game.player2.hand.cards[0], game.player2.stadium);
    playEnergy(game);
    expect(game.player1.active.damage).toBe(60);
  });

  it('switches Jet Energy’s real recipient after it is attached', () => {
    game = setupGame({ turn: 5,
      player1: { active: { card: other }, bench: [{ card: 'Primal Kyogre-EX PRC' }], hand: [jet], deck: padDeck(5) },
      player2: { active: { card: other }, deck: padDeck(5) }
    });
    const target = game.player1.bench[0];
    const energy = game.player1.hand.cards[0];
    playEnergy(game, bench);
    expect(game.player1.active).toBe(target);
    expect(target.cards).toContain(energy);
  });
});
