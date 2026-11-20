import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { Prompt } from '../../game/store/prompts/prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { setupGame, padDeck, PokemonSlotConfig } from './test-helpers';

const heavy = 'Heavy Baton PAR';
const wishful = 'Wishful Baton BUS';
const share = 'Exp. Share SVI';
const hands = 'Iron Hands ex PAR';
const mew = 'Mew ex MEW';
const pecharunt = 'Pecharunt ex SFA';
const fire = 'Fire Energy SVE';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const psychic = 'Psychic Energy SVE';
const special = 'Jet Energy PAL';
const mine = (index: number) => ({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
const myActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const theirs = (index: number) => ({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
const otherActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const basicAttack = 'Photon Blaster';

function battle(options: {
  active?: PokemonSlotConfig;
  bench?: PokemonSlotConfig[];
  attacker?: PokemonSlotConfig;
  stadium?: string;
} = {}) {
  const game = setupGame({
    turn: 5,
    player1: {
      active: options.attacker ?? { card: 'Miraidon ex SVI', energy: ['Lightning Energy SVE', 'Lightning Energy SVE', dark] },
      hand: options.stadium ? [options.stadium] : [],
      deck: padDeck(10)
    },
    player2: {
      active: options.active ?? { card: hands, damage: 30, energy: [fire, water, dark, special], tools: [heavy] },
      bench: options.bench ?? [{ card: mew }, { card: pecharunt }],
      deck: padDeck(10, fire)
    }
  });
  if (options.stadium) {
    game.player1.hand.moveTo(game.player1.stadium);
  }
  return game;
}

describe('Energy and search effects before Knock Out discard', () => {
  it('moves one to three Basic Energy from the still-attached holder, split across the Bench', () => {
    const { store, player1, player2, overridePrompt } = battle();
    const holder = player2.active;
    const energy = holder.cards.filter(card => [fire, water, dark, special].includes(card.fullName));
    const first = player2.bench[0];
    const second = player2.bench[1];
    const prizes = player1.getPrizeLeft();
    overridePrompt('Attach energy', (generic, state) => {
      const prompt = generic as AttachEnergyPrompt;
      expect(holder.getPokemonCard()?.fullName).toBe(hands);
      expect(player2.discard.cards.some(card => energy.includes(card))).toBe(false);
      expect(player1.getPrizeLeft()).toBe(prizes);
      expect(prompt.cardList.cards).toEqual(energy.slice(0, 3));
      expect(prompt.validate(null)).toBe(false);
      expect(prompt.validate([])).toBe(false);
      expect(prompt.validate(prompt.decode([{ index: 0, to: mine(0) }, { index: 0, to: mine(1) }], state))).toBe(false);
      return [{ index: 0, to: mine(0) }, { index: 1, to: mine(1) }, { index: 2, to: mine(1) }];
    });
    store.dispatch(new AttackAction(player1.id, basicAttack));
    expect(first.cards).toContain(energy[0]);
    expect(second.cards).toEqual(jasmine.arrayContaining(energy.slice(1, 3)));
    expect(player2.discard.cards).toContain(energy[3]);
    expect(player1.getPrizeLeft()).toBe(prizes - 2);
  });

  for (const [stadium, expectTransfer] of [
    [undefined, true], ['Calamitous Wasteland PAL', false], ['Beach Court SVI', false]
  ] as const) {
    it(`checks the effective Retreat Cost under ${stadium ?? 'no Stadium'}`, () => {
      const { store, player1, player2 } = battle({ stadium });
      const energy = player2.active.cards.find(card => card.fullName === fire)!;
      const first = player2.bench[0];
      store.dispatch(new AttackAction(player1.id, basicAttack));
      expect(first.cards.includes(energy)).toBe(expectTransfer);
    });
  }

  it('applies Heavy Baton to an effective four on Revavroom ex with three Gravity Gemstones', () => {
    const { store, player1, player2 } = battle({
      active: { card: 'Revavroom ex OBF', damage: 100, energy: [fire],
        tools: [heavy, 'Gravity Gemstone SCR', 'Gravity Gemstone SCR', 'Gravity Gemstone SCR'] }
    });
    const energy = player2.active.cards.find(card => card.fullName === fire)!;
    const recipient = player2.bench[0];
    const cost = new CheckRetreatCostEffect(player2);
    store.reduceEffect(store.state, cost);
    expect(cost.cost.length).toBe(4);
    store.dispatch(new AttackAction(player1.id, basicAttack));
    expect(recipient.cards).toContain(energy);
  });

  for (const tool of [heavy, wishful]) {
    it(`uses ${tool} after Whirlwind moves the lethally damaged Active to the Bench`, () => {
      const { store, player1, player2, overridePrompt } = battle({
        attacker: { card: 'Murkrow GRI', energy: [dark] },
        active: { card: hands, damage: 220, energy: [fire], tools: [tool] }
      });
      const holder = player2.active;
      const promoted = player2.bench[0];
      const recipient = player2.bench[1];
      const energy = holder.cards.find(card => card.fullName === fire)!;
      overridePrompt('Attach energy', (generic, state) => {
        const prompt = generic as AttachEnergyPrompt;
        expect(player2.active).toBe(promoted);
        expect(player2.bench[0]).toBe(holder);
        expect(prompt.validate([{ card: energy, to: mine(0) }])).toBe(false);
        return [{ index: 0, to: mine(1) }];
      });
      store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
      expect(recipient.cards).toContain(energy);
      expect(player2.discard.cards.some(card => card.fullName === hands)).toBe(true);
    });

    it(`rejects Frenzied Gouging as a trigger for ${tool}`, () => {
      const { store, player1, player2, overridePrompt } = battle({
        attacker: { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] },
        active: { card: hands, energy: [fire], tools: [tool] }
      });
      const energy = player2.active.cards.find(card => card.fullName === fire)!;
      overridePrompt('Attach energy', () => { throw new Error('Unexpected Baton transfer'); });
      store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
      expect(player2.discard.cards).toContain(energy);
    });
  }

  it('checks Tool suppression after Whirlwind promotes Flight Night Yveltal', () => {
    const { store, player1, player2 } = battle({
      attacker: { card: 'Murkrow GRI', energy: [dark] },
      active: { card: hands, damage: 220, energy: [fire], tools: [wishful] },
      bench: [{ card: 'Yveltal BKT' }, { card: pecharunt }]
    });
    const energy = player2.active.cards.find(card => card.fullName === fire)!;
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(player2.active.getPokemonCard()?.fullName).toBe('Yveltal BKT');
    expect(player2.discard.cards).toContain(energy);
  });

  it('does not transfer from a Benched Pokémon even when Dual Bolt deals lethal damage', () => {
    const { store, player1, player2, overridePrompt } = battle({
      attacker: { card: 'Electivire ex DRI', energy: ['Lightning Energy SVE', 'Lightning Energy SVE', dark] },
      active: { card: mew },
      bench: [{ card: hands, damage: 200, energy: [water], tools: [heavy] }, { card: pecharunt, tools: [share] }]
    });
    overridePrompt('Choose pokemon', () => [otherActive, theirs(0)]);
    overridePrompt('Attach energy', () => { throw new Error('Unexpected transfer from Bench'); });
    store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
    expect(player2.discard.cards.some(card => card.fullName === water)).toBe(true);
  });

  it('excludes a Pokémon being Knocked Out simultaneously as a transfer destination', () => {
    const { store, player1, player2, overridePrompt } = battle({
      attacker: { card: 'Dragapult ex TWM', energy: [fire, psychic] },
      bench: [{ card: mew, damage: 120, tools: [share] }, { card: pecharunt }]
    });
    const recipient = player2.bench[1];
    const energy = player2.active.cards.find(card => card.fullName === water)!;
    overridePrompt('Put damage', () => [{ target: theirs(0), damage: 60 }]);
    overridePrompt('Select', () => { throw new Error('Expected Heavy Baton as the only legal effect'); });
    overridePrompt('Attach energy', (generic) => {
      expect((generic as AttachEnergyPrompt).options.blockedTo).toContain(mine(0));
      return [{ index: 1, to: mine(1) }];
    });
    store.dispatch(new AttackAction(player1.id, 'Phantom Dive'));
    expect(recipient.cards).toContain(energy);
  });

  for (const [bench, energy] of [
    [[], [fire]], [[{ card: mew, tools: [share] }], [special]], [[{ card: mew }], []]
  ] as [PokemonSlotConfig[], string[]][]) {
    it(`surfaces no transfer with ${bench.length} Bench Pokémon and ${energy.join(', ') || 'no Energy'}`, () => {
      const { store, player1, overridePrompt } = battle({ bench, active: { card: hands, damage: 30, energy, tools: [heavy] } });
      overridePrompt('Attach energy', () => { throw new Error('Unexpected transfer without eligible Energy and destination'); });
      store.dispatch(new AttackAction(player1.id, basicAttack));
    });
  }

  for (const preferShare of [false, true]) {
    it(`lets the turn player order ${preferShare ? 'Exp. Share' : 'Wishful Baton'} first`, () => {
      const { store, player1, player2, overridePrompt } = battle({
        active: { card: hands, damage: 30, energy: [water, fire], tools: [wishful] },
        bench: [{ card: mew, tools: [share] }, { card: pecharunt }]
      });
      const first = player2.bench[0];
      const second = player2.bench[1];
      const energy = player2.active.cards.filter(card => [water, fire].includes(card.fullName));
      let selections = 0;
      let transferCount = 0;
      overridePrompt('Select', (generic) => {
        const prompt = generic as SelectPrompt;
        expect(prompt.playerId).toBe(player1.id);
        expect(prompt.message).toBe(GameMessage.CHOOSE_KNOCK_OUT_EFFECT);
        selections++;
        return prompt.values.findIndex(label => label.startsWith(preferShare ? 'Exp. Share' : 'Wishful Baton'));
      });
      const transfer = (generic: Prompt<unknown>) => {
        const prompt = generic as AttachEnergyPrompt;
        expect(prompt.playerId).toBe(player2.id);
        transferCount++;
        if (preferShare && transferCount === 1) {
          expect(prompt.validate([])).toBe(true);
          expect(prompt.validate([{ card: energy[0], to: mine(1) }])).toBe(false);
          overridePrompt('Attach energy', transfer);
          return [{ index: 0, to: mine(0) }];
        }
        expect(prompt.options.sameTarget).toBe(true);
        return prompt.cardList.cards.map((_, index) => ({ index, to: mine(1) }));
      };
      overridePrompt('Attach energy', transfer);
      store.dispatch(new AttackAction(player1.id, basicAttack));
      expect(selections).toBe(1);
      expect(transferCount).toBe(preferShare ? 2 : 1);
      expect(second.cards).toContain(energy[1]);
      expect((preferShare ? first : second).cards).toContain(energy[0]);
    });
  }

  it('allows two physical copies of Wishful Baton to transfer four Energy with Theta Double', () => {
    const { store, player1, player2 } = battle({
      active: { card: 'M Tyranitar-EX AOR', damage: 60, energy: [water, fire, dark, psychic], tools: [wishful, wishful] }
    });
    const recipient = player2.bench[0];
    const energy = player2.active.cards.filter(card => [water, fire, dark, psychic].includes(card.fullName));
    store.dispatch(new AttackAction(player1.id, basicAttack));
    expect(recipient.cards).toEqual(jasmine.arrayContaining(energy));
  });

  it('allows each Exp. Share on the same holder to move one basic Energy and allows passing', () => {
    const { store, player1, player2, overridePrompt } = battle({
      active: { card: hands, damage: 30, energy: [water, fire, dark] },
      bench: [{ card: 'M Tyranitar-EX AOR', tools: [share, share] }, { card: mew, tools: [share] }]
    });
    const holder = player2.bench[0];
    const pass = player2.bench[1];
    const cards = player2.active.cards.filter(card => [water, fire, dark].includes(card.fullName));
    const chooseEffect = (generic: Prompt<unknown>) => {
      overridePrompt('Select', chooseEffect);
      return (generic as SelectPrompt).values.findIndex(name => name.includes('Tyranitar'));
    };
    overridePrompt('Select', chooseEffect);
    let count = 0;
    const transfer = (generic: Prompt<unknown>) => {
      const prompt = generic as AttachEnergyPrompt;
      expect(prompt.options.max).toBe(1);
      if (++count === 3) return null;
      overridePrompt('Attach energy', transfer);
      return [{ index: 0, to: mine(0) }];
    };
    overridePrompt('Attach energy', transfer);
    store.dispatch(new AttackAction(player1.id, basicAttack));
    expect(count).toBe(3);
    expect(holder.cards).toEqual(jasmine.arrayContaining(cards.slice(0, 2)));
    expect(pass.cards.includes(cards[2])).toBe(false);
    expect(player2.discard.cards).toContain(cards[2]);
  });

  it('lets Exp. Share move an Energy to its holder promoted by Whirlwind', () => {
    const { store, player1, player2, overridePrompt } = battle({
      attacker: { card: 'Murkrow GRI', energy: [dark] },
      active: { card: hands, damage: 220, energy: [fire] },
      bench: [{ card: mew, tools: [share] }, { card: pecharunt }]
    });
    const energy = player2.active.cards.find(card => card.fullName === fire)!;
    overridePrompt('Attach energy', () => [{ index: 0, to: myActive }]);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(player2.active.getPokemonCard()?.fullName).toBe(mew);
    expect(player2.active.cards).toContain(energy);
  });

  it('resolves Wishful Baton before Lost Out and sends only the remaining stack to the Lost Zone', () => {
    const { store, player1, player2, overridePrompt } = battle({
      attacker: { card: 'Tyranitar-GX LOT', energy: [dark, dark, dark] },
      active: { card: mew, damage: 60, energy: [water, special], tools: [wishful] }
    });
    const recipient = player2.bench[0];
    const energy = player2.active.cards.find(card => card.fullName === water)!;
    overridePrompt('Attach energy', () => [{ index: 0, to: mine(0) }]);
    store.dispatch(new AttackAction(player1.id, 'Dusty Ruckus'));
    expect(recipient.cards).toContain(energy);
    expect(player2.lostzone.cards.map(card => card.fullName)).toEqual(jasmine.arrayContaining([mew, wishful, special]));
    expect(player2.lostzone.cards).not.toContain(energy);
  });

  it('preserves Lost City attachments stored only in legacy energy and Tool lists', () => {
    const { store, player1, player2 } = battle({ stadium: 'Lost City LOR' });
    const holder = player2.active;
    const energy = holder.cards.find(card => card.fullName === fire)!;
    const tool = holder.tools[0];
    holder.cards.splice(holder.cards.indexOf(energy), 1);
    if (!holder.energies.cards.includes(energy)) holder.energies.cards.push(energy);
    const recipient = player2.bench[0];
    store.dispatch(new AttackAction(player1.id, basicAttack));
    expect(recipient.cards).toContain(energy);
    expect(player2.lostzone.cards.some(card => card.fullName === hands)).toBe(true);
    expect(player2.discard.cards).toContain(tool);
    expect(player2.discard.cards).not.toContain(energy);
  });

  for (const accept of [false, true]) {
    it(`lets Huntail ${accept ? 'return' : 'leave'} only Basic Water Energy before discard`, () => {
      const { store, player1, player2, overridePrompt } = battle({
        active: { card: 'Origin Forme Palkia VSTAR ASR', damage: 100, energy: [water, fire, water, special] },
        bench: [{ card: 'Huntail DRI' }]
      });
      const holder = player2.active;
      const waters = holder.cards.filter(card => card.fullName === water);
      const other = holder.cards.filter(card => [fire, special].includes(card.fullName));
      overridePrompt('Confirm', () => {
        expect(holder.getPokemonCard()).toBeDefined();
        return accept;
      });
      store.dispatch(new AttackAction(player1.id, basicAttack));
      expect(accept ? player2.hand.cards : player2.discard.cards).toEqual(jasmine.arrayContaining(waters));
      expect(player2.discard.cards).toEqual(jasmine.arrayContaining(other));
    });
  }

  it('does not allow Diver’s Catch after a non-damage Knock Out', () => {
    const { store, player1, player2, overridePrompt } = battle({
      attacker: { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] },
      active: { card: 'Origin Forme Palkia VSTAR ASR', energy: [water] },
      bench: [{ card: 'Huntail DRI' }]
    });
    const card = player2.active.cards.find(card => card.fullName === water)!;
    overridePrompt('Confirm', () => { throw new Error('Unexpected Diver’s Catch'); });
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    expect(player2.discard.cards).toContain(card);
  });

  it('lets Amulet of Hope finish its search and shuffle while its holder is still in play', () => {
    const { store, player1, player2, overridePrompt } = battle({
      active: { card: mew, tools: ['Amulet of Hope SSP'] }
    });
    const holder = player2.active;
    const selected = player2.deck.cards[0];
    overridePrompt('Choose cards', prompt => {
      expect(holder.getPokemonCard()?.fullName).toBe(mew);
      expect((prompt as ChooseCardsPrompt).validate([])).toBe(true);
      return [0];
    });
    overridePrompt('Shuffle deck', () => {
      expect(holder.getPokemonCard()?.fullName).toBe(mew);
      expect(player2.hand.cards).toContain(selected);
      return player2.deck.cards.map((_, i) => i);
    });
    store.dispatch(new AttackAction(player1.id, basicAttack));
    expect(player2.discard.cards.some(card => card.fullName === mew)).toBe(true);
    expect(player2.hand.cards).toContain(selected);
  });
});
