import { GameLog } from '../../game/game-message';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const basicMetal = 'Metal Energy SVE';
const neo = 'Metal Energy N1';
const aquapolis = 'Metal Energy AQ';
const arceus = { card: 'Arceus V BRS' };
const powerEdge = { ...arceus, energy: [water, water, water] };
const dark = 'Darkness Energy SVE';
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const ownBench = { ...ownActive, slot: SlotType.BENCH };
const board = { ...ownActive, slot: SlotType.BOARD };

function battle(left: PlayerConfig, right: PlayerConfig = { active: arceus }) {
  return setupGame({
    turn: 5,
    player1: { bench: [{ card: 'Rookidee SSH' }], deck: padDeck(16), ...left },
    player2: { bench: [arceus], deck: padDeck(16), ...right }
  });
}

function damage(left: PlayerConfig, right: PlayerConfig, attack: string): number {
  const { store, player1 } = battle(left, right);
  store.dispatch(new AttackAction(player1.id, attack));
  return Number(store.state.logs.find(log => log.message === GameLog.LOG_PLAYER_DEALS_DAMAGE
    && log.params?.effect === attack)?.params?.damage ?? 0);
}

describe('Special Metal Energy print rules', () => {
  for (const print of [neo, aquapolis]) {
    it(`applies ${print}'s non-Metal attack penalty before Weakness`, () => {
      expect(damage({ active: { card: 'Kingler GE', energy: [water, print] } },
        { active: { card: 'Charizard PGO' } }, 'Crabhammer')).toBe(40);
    });

    it(`lets ${print} protect a non-Metal holder`, () => {
      expect(damage({ active: powerEdge }, { active: { ...arceus, energy: [print] } }, 'Power Edge')).toBe(120);
    });
  }

  for (const print of ['Metal Energy MT', 'Metal Energy SW', 'Metal Energy MD', 'Metal Energy RR', 'Metal Energy UD']) {
    it(`only grants ${print}'s defensive benefit to a Metal Pokémon`, () => {
      expect(damage({ active: powerEdge }, { active: { ...arceus, energy: [print] } }, 'Power Edge')).toBe(130);
      expect(damage({ active: powerEdge }, { active: { card: 'Duraludon SSP', energy: [print] } }, 'Power Edge')).toBe(120);
    });

    it(`has no outgoing penalty for ${print} on a non-Metal Pokémon`, () => {
      expect(damage({ active: { card: 'Kingler GE', energy: [water, print] } },
        { active: arceus }, 'Crabhammer')).toBe(30);
    });
  }

  it('stacks two defending copies after Weakness and leaves Basic Metal Energy inert', () => {
    const attacker = { card: 'Charmander BS', energy: ['Fire Energy SVE', water] };
    expect(damage({ active: attacker }, { active: { card: 'Duraludon SSP',
      energy: [neo, 'Metal Energy UD', basicMetal] } }, 'Ember')).toBe(40);
  });

  it('lets Shred ignore defending Energy while the attacker keeps its own outgoing penalty', () => {
    const attacker = { card: "N's Zekrom M2a", energy: [dark, dark, dark] };
    const defender = { card: 'Duraludon SSP', energy: [aquapolis, 'Metal Energy UD'] };
    expect(damage({ active: attacker }, { active: defender }, 'Shred')).toBe(70);
    expect(damage({ active: { ...attacker, energy: [...attacker.energy, neo] } },
      { active: defender }, 'Shred')).toBe(60);
  });

  it('applies the outgoing penalty to damage on the Bench without Weakness', () => {
    const { store, player1, player2, overridePrompt } = battle(
      { active: { card: 'Garchomp ex PAR', energy: [water, water, neo] } },
      { active: arceus, bench: [{ card: 'Charizard PGO' }] }
    );
    overridePrompt('Choose energy', () => [0, 1]);
    overridePrompt('Choose pokemon', () => [{ ...ownBench, player: PlayerType.TOP_PLAYER }]);
    store.dispatch(new AttackAction(player1.id, 'Sonic Dive'));
    expect(player2.bench[0].damage).toBe(110);
  });
});

describe('Physical Energy attachments from selected cards', () => {
  for (const attach of [true, false]) {
    it(`Charging Trumpet ${attach ? 'moves selected Basic Energy' : 'can select zero'} and keeps the remaining cards`, () => {
      const { store, player1, overridePrompt } = battle({
        active: { card: 'Pikipek VIV' }, hand: ['Trumbeak VIV'],
        deck: [water, 'Double Turbo Energy BRS', 'Fire Energy SVE', ...padDeck(16)]
      });
      const [first, special, third] = player1.deck.cards;
      overridePrompt('Confirm', () => true);
      overridePrompt('Attach energy', prompt => {
        const choices = (prompt as AttachEnergyPrompt).cardList.cards;
        expect(choices).toEqual([first, special, third]);
        return attach ? [{ index: 0, to: ownActive }, { index: 2, to: ownBench }] : [];
      });
      store.dispatch(new PlayCardAction(player1.id, 0, ownActive));
      expect(player1.active.cards.includes(first)).toBe(attach);
      expect(player1.bench[0].cards.includes(third)).toBe(attach);
      expect(player1.deck.cards.includes(first)).toBe(!attach);
      expect(player1.deck.cards.includes(third)).toBe(!attach);
      expect(player1.deck.cards).toContain(special);
    });
  }

  it('Charging Trumpet does not trigger when Moonlit Miracle evolves Pikipek from the deck', () => {
    const { store, player1, overridePrompt } = battle({
      active: { card: 'Clefable BRS 54', energy: [water] }, bench: [{ card: 'Pikipek VIV' }],
      deck: ['Trumbeak VIV', ...padDeck(16)]
    });
    const trumbeak = player1.deck.cards[0];
    const confirm = jasmine.createSpy('Charging Trumpet').and.returnValue(true);
    overridePrompt('Confirm', confirm);
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Choose cards', prompt => [(prompt as ChooseCardsPrompt).cards.cards.indexOf(trumbeak)]);
    store.dispatch(new AttackAction(player1.id, 'Moonlit Miracle'));
    expect(player1.bench[0].getPokemonCard()?.id).toBe(trumbeak.id);
    expect(confirm).not.toHaveBeenCalled();
  });

  it('Bea attaches only selected cards among the five just discarded', () => {
    const { store, player1, overridePrompt } = battle({
      active: arceus, bench: [{ card: 'Hitmontop VIV' }, { card: 'Rookidee SSH' }],
      hand: ['Bea VIV'], discard: ['Water Energy SVE'],
      deck: ['Double Turbo Energy BRS', 'Ralts SIT', basicMetal, 'Ralts SIT', 'Ralts SIT', ...padDeck(16)]
    });
    const earlier = player1.discard.cards[0];
    const [special, , unselected] = player1.deck.cards;
    overridePrompt('Attach energy', prompt => {
      const choices = (prompt as AttachEnergyPrompt).cardList.cards;
      expect(choices).toContain(special);
      expect(choices).not.toContain(earlier);
      expect(player1.discard.cards).toContain(special);
      return [{ index: choices.indexOf(special), to: ownBench }];
    });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(player1.bench[0].cards).toContain(special);
    expect(player1.discard.cards).not.toContain(special);
    expect(player1.discard.cards).toContain(unselected);
    expect(player1.discard.cards).toContain(earlier);
  });

  it('Energy Link moves the selected Special Energy from the discard pile after damage', () => {
    const { store, player1, player2, overridePrompt } = battle({
      active: { card: 'Melmetal DAA', energy: [basicMetal] }, discard: ['Double Turbo Energy BRS', water]
    });
    const selected = player1.discard.cards[0];
    overridePrompt('Choose cards', prompt => {
      expect(player2.active.damage).toBe(30);
      return [(prompt as ChooseCardsPrompt).cards.cards.indexOf(selected)];
    });
    store.dispatch(new AttackAction(player1.id, 'Energy Link'));
    expect(player1.active.cards).toContain(selected);
    expect(player1.discard.cards).not.toContain(selected);
  });

  for (const index of [0, 1]) {
    it(`assembles Lugia from half ${index + 1} and Ocean Grow attaches every Energy and discards the rest`, () => {
      const { store, player1, overridePrompt } = battle({
        active: arceus, bench: [], hand: ['Lugia LEGEND HS', 'Lugia LEGEND HS 114'],
        deck: [water, 'Double Turbo Energy BRS', 'Ralts SIT', 'Ralts SIT', 'Ralts SIT', ...padDeck(16)]
      });
      const [top, bottom] = player1.hand.cards;
      const lookedAt = player1.deck.cards.slice(0, 5);
      const [basic, special, ...others] = lookedAt;
      const reveal = jasmine.createSpy('reveal').and.callFake((prompt: ShowCardsPrompt) => {
        expect(prompt.cards).toEqual(lookedAt);
        return true;
      });
      overridePrompt('Show cards', reveal);
      store.dispatch(new UseAbilityAction(player1.id, 'Legend Assembly', { ...board, slot: SlotType.HAND, index }));
      expect(reveal).toHaveBeenCalledTimes(1);
      expect(player1.bench[0].cards.slice(0, 2)).toEqual([bottom, top]);
      expect(player1.bench[0].getPokemonCard()?.id).toBe(top.id);
      for (const energy of [basic, special]) {
        expect(player1.bench[0].cards.includes(energy)).toBe(true);
        expect(player1.discard.cards.includes(energy)).toBe(false);
      }
      for (const card of others) expect(player1.discard.cards.includes(card)).toBe(true);
      expect(player1.deck.cards.some(card => lookedAt.includes(card))).toBe(false);
    });
  }

  it('rejects playing two copies of the same Lugia half', () => {
    const { store, player1 } = battle({ active: arceus, bench: [], hand: ['Lugia LEGEND HS', 'Lugia LEGEND HS'] });
    expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Legend Assembly',
      { ...board, slot: SlotType.HAND }))).toThrow();
    expect(player1.bench[0].cards.length).toBe(0);
    expect(player1.hand.cards.length).toBe(2);
  });
});
