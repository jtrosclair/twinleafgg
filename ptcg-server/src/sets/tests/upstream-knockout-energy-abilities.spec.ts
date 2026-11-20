import { GameMessage } from '../../game/game-message';
import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { CheckPrizesDestinationEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { GamePhase, GameWinner, State } from '../../game/store/state/state';
import { padDeck, PokemonSlotConfig, setupGame } from './test-helpers';

const miraidon = 'Miraidon ex SVI';
const dualBolt = 'Electivire ex DRI';
const moon = 'Roaring Moon ex PAR';
const jirachi = 'Jirachi V ASR 170';
const kingdra = 'Kingdra BST';
const modern = 'Lanturn CES';
const retro = 'Lanturn HL';
const mew = 'Mew ex MEW';
const arceus = 'Arceus V BRS';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const lightning = 'Lightning Energy SVE';
const fire = 'Fire Energy SVE';
const wash = 'Wash Water Energy VIV';
const aurora = 'Aurora Energy SSH';
const splash = 'Splash Energy BKP';
const share = 'Exp. Share SVI';
const photon = 'Photon Blaster';
const basicAttacker = { card: miraidon, energy: [lightning, lightning, dark] };
const moonAttacker = { card: moon, energy: [dark, dark, dark] };
const theirs = (index: number) => ({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
const mine = (index: number) => ({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
const theirActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const myActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

function battle(active: PokemonSlotConfig, bench: PokemonSlotConfig[], {
  attacker = basicAttacker, stadium = '', prizeCount = 2, defenderHand = [] as string[]
} = {}) {
  const game = setupGame({
    turn: 5,
    player1: { active: attacker, hand: stadium ? [stadium] : [], prizeCount, deck: padDeck(10) },
    player2: { active, bench, hand: defenderHand, deck: padDeck(10) }
  });
  if (stadium) game.player1.hand.moveTo(game.player1.stadium);
  return game;
}

describe('Knock Out Energy Abilities', () => {
  it('uses Wish Connector when the Knocked Out Basic Pokémon V is Jirachi V itself', () => {
    const game = battle({ card: jirachi, energy: [water, wash] }, [{ card: mew }]);
    const { player1, player2, store, overridePrompt } = game;
    const attached = player2.active.cards.find(card => card.fullName === water)!;
    const recipient = player2.bench[0];
    overridePrompt('Attach energy', generic => {
      const prompt = generic as AttachEnergyPrompt;
      expect(player2.active.getPokemonCard()?.fullName).toBe(jirachi);
      expect(player1.getPrizeLeft()).toBe(2);
      expect(prompt.cardList.cards).toEqual([attached]);
      expect(prompt.validate(null)).toBe(true);
      expect(prompt.validate([{ card: attached, to: myActive }])).toBe(false);
      return [{ index: 0, to: mine(0) }];
    });
    store.dispatch(new AttackAction(player1.id, photon));
    expect(recipient.cards).toContain(attached);
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
  });

  it('uses one transfer from each copy of Wish Connector', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: arceus, energy: [water, fire] },
      [{ card: jirachi }, { card: jirachi }]);
    const receiver = player2.bench[0];
    const energies = player2.active.cards.filter(card => card.fullName === water || card.fullName === fire);
    overridePrompt('Select', generic => {
      const prompt = generic as SelectPrompt;
      expect(prompt.playerId).toBe(player1.id);
      expect(prompt.values).toEqual(['Wish Connector', 'Wish Connector']);
      overridePrompt('Attach energy', () => {
        overridePrompt('Attach energy', second => {
          expect((second as AttachEnergyPrompt).cardList.cards).toEqual([energies[1]]);
          return [{ index: 0, to: mine(0) }];
        });
        return [{ index: 0, to: mine(0) }];
      });
      return 0;
    });
    store.dispatch(new AttackAction(player1.id, photon));
    expect(receiver.cards).toEqual(jasmine.arrayContaining(energies));
  });

  it('can use Wish Connector for a Benched Basic Pokémon V', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: jirachi },
      [{ card: arceus, damage: 170, energy: [water] }], { attacker: { ...basicAttacker, card: dualBolt } });
    const attached = player2.bench[0].cards.find(card => card.fullName === water)!;
    overridePrompt('Choose pokemon', () => [theirActive, theirs(0)]);
    overridePrompt('Attach energy', () => [{ index: 0, to: myActive }]);
    store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
    expect(player2.active.cards).toContain(attached);
  });

  for (const [name, active, attacker, attack, stadium] of [
    ['an attack effect', arceus, moonAttacker, 'Frenzied Gouging', ''],
    ['a Pokémon VSTAR', 'Arceus VSTAR BRS', basicAttacker, photon, ''],
    ['a suppressed Wish Connector', arceus, basicAttacker, photon, 'Path to the Peak CRE']
  ] as const) {
    it(`skips Wish Connector for ${name}`, () => {
      const { player1, player2, store, overridePrompt } = battle({ card: active, energy: [water], damage: 60 },
        [{ card: jirachi }], { attacker, stadium });
      const attached = player2.active.cards.find(card => card.fullName === water)!;
      overridePrompt('Attach energy', () => { throw new Error('Unexpected Wish Connector prompt'); });
      store.dispatch(new AttackAction(player1.id, attack));
      expect(player2.discard.cards).toContain(attached);
    });
  }

  for (const stadium of ['', 'Temple of Sinnoh ASR']) {
    it(`Deep Sea King checks the Energy actually provided under ${stadium || 'normal conditions'}`, () => {
      const { player1, player2, store, overridePrompt } = battle({ card: mew, energy: [water, wash, aurora, fire] },
        [{ card: kingdra }], { stadium });
      const eligible = stadium ? [water] : [water, wash, aurora];
      const receiver = player2.bench[0];
      overridePrompt('Choose cards', generic => {
        const prompt = generic as ChooseCardsPrompt;
        expect(prompt.cards.cards.map(card => card.fullName)).toEqual(eligible);
        expect(prompt.options.min).toBe(0);
        expect(player2.active.getPokemonCard()?.fullName).toBe(mew);
        return eligible.map((_, index) => index);
      });
      store.dispatch(new AttackAction(player1.id, photon));
      expect(receiver.cards.filter(card => eligible.includes(card.fullName)).map(card => card.fullName)).toEqual(eligible);
      expect(player2.discard.cards.some(card => card.fullName === fire)).toBe(true);
    });
  }

  it('can split Water Energy between two Kingdra and only offers cards still attached', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: mew, energy: [water, wash] },
      [{ card: kingdra }, { card: kingdra }]);
    const recipients = player2.bench.slice(0, 2);
    overridePrompt('Select', generic => {
      const prompt = generic as SelectPrompt;
      expect(prompt.values).toEqual(['Deep Sea King (Kingdra, 1)', 'Deep Sea King (Kingdra, 2)']);
      overridePrompt('Choose cards', () => {
        overridePrompt('Choose cards', next => {
          expect((next as ChooseCardsPrompt).cards.cards.map(card => card.fullName)).toEqual([wash]);
          return [0];
        });
        return [0];
      });
      return 0;
    });
    store.dispatch(new AttackAction(player1.id, photon));
    expect(recipients[0].cards.some(card => card.fullName === water)).toBe(true);
    expect(recipients[1].cards.some(card => card.fullName === wash)).toBe(true);
  });

  it('uses Deep Sea King after Whirlwind moves the lethally damaged Active to the Bench', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: mew, damage: 170, energy: [water] },
      [{ card: 'Pecharunt ex SFA' }, { card: kingdra }],
      { attacker: { card: 'Murkrow GRI', energy: [dark] } });
    const holder = player2.active;
    const receiver = player2.bench[1];
    overridePrompt('Choose cards', () => {
      expect(player2.active).not.toBe(holder);
      return [0];
    });
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(receiver.cards.some(card => card.fullName === water)).toBe(true);
  });

  it('moves an attached Holon Pokémon as Energy and keeps Kingdra on top of the stack', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: mew }, [{ card: kingdra }],
      { defenderHand: ["Holon's Castform HP"] });
    const holder = player2.active;
    const receiver = player2.bench[0];
    const castform = player2.hand.cards[0];
    // Older serialized slots can store the same attachment in both lists.
    player2.hand.moveCardTo(castform, holder);
    holder.energies.cards.push(castform);
    overridePrompt('Choose cards', generic => {
      expect((generic as ChooseCardsPrompt).cards.cards).toEqual([castform]);
      return [0];
    });
    store.dispatch(new AttackAction(player1.id, photon));
    expect(receiver.getPokemonCard()?.fullName).toBe(kingdra);
    expect(receiver.energies.cards).toContain(castform);
    const check = new CheckProvidedEnergyEffect(player2, receiver);
    store.reduceEffect(store.state, check);
    expect(check.energyMap.find(({ card }) => card === castform)?.provides).toEqual([CardType.ANY, CardType.ANY]);
  });

  for (const first of ['Deep Sea King', 'Splash Energy']) {
    it(`honors the Deep Sea King and Splash Energy interaction when ${first} goes first`, () => {
      const { player1, player2, store, overridePrompt } = battle({ card: 'Seadra BST', energy: [splash] },
        [{ card: kingdra }], { prizeCount: 1 });
      const holder = player2.active.getPokemonCard()!;
      const energy = player2.active.cards.find(card => card.fullName === splash)!;
      const receiver = player2.bench[0];
      overridePrompt('Select', generic => {
        const prompt = generic as SelectPrompt;
        expect(prompt.values.length).toBe(2);
        return prompt.values.findIndex(value => value.startsWith(first));
      });
      overridePrompt('Choose cards', () => [0]);
      store.dispatch(new AttackAction(player1.id, photon));
      expect(player2.hand.cards.includes(holder)).toBe(first === 'Splash Energy');
      expect(player2.discard.cards.includes(holder)).toBe(first === 'Deep Sea King');
      expect(receiver.cards.includes(energy)).toBe(first === 'Deep Sea King');
      expect(store.state.phase).toBe(GamePhase.FINISHED);
    });
  }

  it('discards an ineligible Splash Energy while leaving the Pokémon and other attachments in play', () => {
    const { player1, player2, store } = battle({ card: mew, energy: [splash, water] }, [{ card: kingdra }]);
    const holder = player2.active.getPokemonCard();
    const energy = player2.active.cards.find(card => card.fullName === splash)!;
    store.dispatch(new PassTurnAction(player1.id));
    expect(player2.active.getPokemonCard()).toBe(holder);
    expect(player2.active.cards.some(card => card.fullName === water)).toBe(true);
    expect(player2.discard.cards).toContain(energy);
  });

  for (const first of ['Exp. Share', 'Energy Grounding']) {
    it(`lets the turn player order ${first} first on the same Knock Out`, () => {
      const { player1, player2, store, overridePrompt } = battle({ card: mew, energy: [water] },
        [{ card: modern }, { card: 'Pecharunt ex SFA', tools: [share] }]);
      const energy = player2.active.cards.find(card => card.fullName === water)!;
      const lanturn = player2.bench[0];
      const shareRecipient = player2.bench[1];
      overridePrompt('Select', generic => {
        const prompt = generic as SelectPrompt;
        expect(prompt.playerId).toBe(player1.id);
        expect(prompt.message).toBe(GameMessage.CHOOSE_KNOCK_OUT_EFFECT);
        return prompt.values.findIndex(value => value.startsWith(first));
      });
      overridePrompt('Attach energy', () => [{ index: 0, to: mine(1) }]);
      overridePrompt('Choose cards', () => {
        expect(player2.active.getPokemonCard()?.fullName).toBe(mew);
        return [0];
      });
      store.dispatch(new AttackAction(player1.id, photon));
      expect(lanturn.cards.includes(energy)).toBe(first === 'Energy Grounding');
      expect(shareRecipient.cards.includes(energy)).toBe(first === 'Exp. Share');
    });
  }

  for (const printing of [modern, retro]) {
    it(`distinguishes an attack effect Knock Out with ${printing}`, () => {
      const { player1, player2, store, overridePrompt } = battle({ card: mew, energy: [fire] },
        [{ card: printing }], { attacker: moonAttacker });
      const card = player2.active.getPokemonCard()!;
      const energy = player2.active.cards.find(item => item.fullName === fire)!;
      const receiver = player2.bench[0];
      overridePrompt('Attach energy', () => {
        expect(printing).toBe(retro);
        expect(player2.discard.cards).toContain(card);
        expect(player2.discard.cards).toContain(energy);
        expect(player1.getPrizeLeft()).toBe(2);
        return [{ index: 0, to: mine(0) }];
      });
      overridePrompt('Choose cards', () => { throw new Error('Unexpected attack damage trigger'); });
      store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
      expect(receiver.cards.includes(energy)).toBe(printing === retro);
      expect(player2.discard.cards.includes(energy)).toBe(printing === modern);
    });
  }

  for (const printing of [modern, retro]) {
    it(`resolves the right number of transfers for two simultaneous damage Knock Outs with ${printing}`, () => {
      const { player1, player2, store, overridePrompt } = battle({ card: mew, damage: 145, energy: [water] },
        [{ card: arceus, damage: 185, energy: [fire] }, { card: printing }],
        { attacker: { ...basicAttacker, card: dualBolt }, prizeCount: 4 });
      const previous = player2.active;
      const victim = player2.bench[0];
      const receiver = player2.bench[1];
      const attached = [previous, victim].map(slot => slot.cards.find(card => [water, fire].includes(card.fullName))!);
      overridePrompt('Choose pokemon', () => [theirActive, theirs(0)]);
      if (printing === modern) {
        overridePrompt('Choose cards', first => {
          expect((first as ChooseCardsPrompt).cards.cards).toEqual([attached[0]]);
          overridePrompt('Choose cards', second => {
            expect((second as ChooseCardsPrompt).cards.cards).toEqual([attached[1]]);
            return [0];
          });
          return [0];
        });
      } else {
        overridePrompt('Attach energy', first => {
          expect((first as AttachEnergyPrompt).cardList.cards).toEqual([attached[0]]);
          overridePrompt('Attach energy', () => { throw new Error('A second Energy Grounding prompt'); });
          return [{ index: 0, to: mine(1) }];
        });
      }
      store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
      expect(receiver.cards).toContain(attached[0]);
      expect(receiver.cards.includes(attached[1])).toBe(printing === modern);
      expect(player1.getPrizeLeft()).toBe(0);
    });
  }

  it('lets the owner choose which Hidden Legends Lanturn uses the one transfer', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: mew, energy: [fire] },
      [{ card: retro }, { card: retro }, { card: kingdra }]);
    const energy = player2.active.cards.find(card => card.fullName === fire)!;
    const first = player2.bench[0];
    const second = player2.bench[1];
    overridePrompt('Attach energy', generic => {
      const prompt = generic as AttachEnergyPrompt;
      expect(prompt.playerId).toBe(player2.id);
      expect(prompt.options.blockedTo).toEqual([mine(2)]);
      return [{ index: 0, to: mine(1) }];
    });
    store.dispatch(new AttackAction(player1.id, photon));
    expect(first.cards).not.toContain(energy);
    expect(second.cards).toContain(energy);
  });

  for (const stadium of ['Lost City LOR', '']) {
    it(`takes Energy Grounding's own discarded card through ${stadium || 'a regular Knock Out'} before the final Prize`, () => {
      const { player1, player2, store, overridePrompt } = battle({ card: mew, energy: [water] },
        [{ card: retro }], { stadium, defenderHand: [water] });
      const holder = player2.active.getPokemonCard()!;
      const energy = player2.active.cards.find(card => card.fullName === water)!;
      const older = player2.hand.cards[0];
      player2.hand.moveCardTo(older, player2.discard);
      const receiver = player2.bench[0];
      overridePrompt('Attach energy', generic => {
        expect((generic as AttachEnergyPrompt).cardList.cards).toEqual([energy]);
        expect(player2.discard.cards).toContain(energy);
        expect((stadium ? player2.lostzone : player2.discard).cards).toContain(holder);
        return [{ index: 0, to: mine(0) }];
      });
      const originalReduce = store.reduceEffect.bind(store);
      spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CheckPrizesDestinationEffect) expect(receiver.cards).toContain(energy);
        return originalReduce(state, effect);
      });
      store.dispatch(new AttackAction(player1.id, photon));
      expect(receiver.cards).toContain(energy);
      expect(receiver.cards).not.toContain(older);
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    });
  }

  it('uses Hidden Legends Energy Grounding after lethal attack counters on the Bench', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: arceus },
      [{ card: mew, energy: [fire], damage: 120 }, { card: retro }],
      { attacker: { card: 'Dragapult ex TWM', energy: [fire, 'Psychic Energy SVE'] }, prizeCount: 4 });
    const energy = player2.bench[0].cards.find(card => card.fullName === fire)!;
    const receiver = player2.bench[1];
    overridePrompt('Put damage', () => [{ target: theirs(0), damage: 60 }]);
    overridePrompt('Attach energy', generic => {
      expect((generic as AttachEnergyPrompt).cardList.cards).toEqual([energy]);
      expect(player2.discard.cards).toContain(energy);
      return [{ index: 0, to: mine(1) }];
    });
    store.dispatch(new AttackAction(player1.id, 'Phantom Dive'));
    expect(receiver.cards).toContain(energy);
  });

  it('does not offer Hidden Legends Energy Grounding after a poison Knock Out', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: mew, energy: [water], damage: 170 },
      [{ card: retro }]);
    player2.active.specialConditions = [SpecialCondition.POISONED];
    overridePrompt('Attach energy', () => { throw new Error('Unexpected Checkup transfer'); });
    store.dispatch(new PassTurnAction(player1.id));
    expect(player2.discard.cards.some(card => card.fullName === water)).toBe(true);
  });

  for (const [printing, damage] of [[modern, 140], [retro, 90]] as const) {
    for (const choose of [true, false]) {
      it(`discards only effective Lightning Energy with ${printing} when confirmed = ${choose}`, () => {
        const { player1, player2, store, overridePrompt } = battle({ card: mew }, [{ card: kingdra }],
          { attacker: { card: printing, energy: [lightning, lightning, aurora, water] } });
        const lightningCards = player1.active.cards.filter(card => [lightning, aurora].includes(card.fullName));
        overridePrompt('Confirm', () => choose);
        store.dispatch(new AttackAction(player1.id, 'Lightning Strike'));
        expect(player2.active.damage).toBe(choose ? damage : (printing === modern ? 70 : 50));
        expect(player1.active.cards.some(card => card.fullName === water)).toBe(true);
        expect(lightningCards.every(card => player1.discard.cards.includes(card))).toBe(choose);
      });
    }
  }

  it('does not misapply Battle Frontier to a Lightning Poké-Power', () => {
    const { player1, player2, store, overridePrompt } = battle({ card: mew, energy: [water] },
      [{ card: retro }], { stadium: 'Battle Frontier PK' });
    overridePrompt('Attach energy', () => [{ index: 0, to: mine(0) }]);
    const receiver = player2.bench[0];
    store.dispatch(new AttackAction(player1.id, photon));
    expect(receiver.cards.some(card => card.fullName === water)).toBe(true);
  });
});
