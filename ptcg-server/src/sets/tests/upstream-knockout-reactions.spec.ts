import { GameLog } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameWinner } from '../../game/store/state/state';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const fighting = 'Fighting Energy SVE';
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const murkrow = { card: 'Murkrow GRI', energy: [dark] };
const mantine = 'Mantine FST 61';
const shaymin = { card: 'Shaymin LV.X PL2', energy: [grass, grass] };
const zekrom = { card: "N's Zekrom M2a", energy: [dark, dark, dark] };
const floatzel = { card: 'Floatzel GL LV.X RR' };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const theirBench = { ...ownBench, player: PlayerType.TOP_PLAYER };

function battle(left: PlayerConfig, right: PlayerConfig) {
  return setupGame({
    turn: 5,
    player1: { bench: [{ card: 'Mew ex MEW' }], deck: padDeck(16), ...left },
    player2: { bench: [{ card: 'Arceus V BRS' }], deck: padDeck(16), ...right }
  });
}

describe('Burning Coat', () => {
  const entei = { card: 'Entei SW', energy: [fire, fire, fire] };

  it('discards the top three cards before the opponent needs to draw', () => {
    const { store, player1, player2, overridePrompt } = battle({ active: entei },
      { active: { card: 'Rookidee SSH' }, deck: padDeck(3) });
    const discarded = player2.deck.cards.slice();
    overridePrompt('Choose pokemon', () => [theirBench]);
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Blaze Roar'));
    expect(discarded.every(card => player2.discard.cards.includes(card))).toBe(true);
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
  });

  it('discards three cards for each opposing Knock Out, including a Benched Pokémon', () => {
    const { store, player1, player2, overridePrompt } = battle({ active: entei }, {
      active: { card: 'Rookidee SSH' },
      bench: [{ card: 'Pidgey OBF', damage: 40 }, { card: 'Arceus V BRS' }]
    });
    const milled = player2.deck.cards.slice(0, 6);
    overridePrompt('Choose pokemon', () => [theirBench]);
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Blaze Roar'));
    expect(milled.every(card => player2.discard.cards.includes(card))).toBe(true);
    expect(player1.getPrizeLeft()).toBe(4);
  });

  it('discards two Energy cards on tails, including an attached non-Fire card', () => {
    const { store, player1 } = battle({ active: { ...entei, energy: [water, fire, fire, fire] } },
      { active: { card: 'Arceus V BRS' }, bench: [] });
    const nonFireEnergy = player1.active.cards.find(card => card.fullName === water);
    spyOn(Math, 'random').and.returnValue(0.9);
    store.dispatch(new AttackAction(player1.id, 'Blaze Roar'));
    expect(player1.discard.cards.length).toBe(2);
    expect(player1.discard.cards).toContain(nonFireEnergy!);
  });
});

describe('Darkness Wing', () => {
  for (const copied of [false, true]) {
    it(`recovers from the attacker's discard for a ${copied ? 'copied' : 'direct'} attack`, () => {
      const honchkrow = 'Honchkrow LV.X SW';
      const { store, player1, player2, overridePrompt } = battle({
        active: { card: copied ? 'Mew ex MEW' : honchkrow, energy: [dark, dark, dark] }, discard: [water]
      }, { active: copied ? { card: honchkrow, damage: 50 } : { card: 'Rookidee SSH' }, discard: [fire] });
      const chosen = player1.discard.cards[0];
      const opponentDiscard = player2.discard.cards[0];
      if (copied) overridePrompt('Choose attack', () => ({ index: 0, attack: 'Darkness Wing' }));
      overridePrompt('Confirm', () => true);
      overridePrompt('Choose cards', () => [0]);
      store.dispatch(new AttackAction(player1.id, copied ? 'Genome Hacking' : 'Darkness Wing'));
      expect(player1.hand.cards).toContain(chosen);
      expect(player2.discard.cards).toContain(opponentDiscard);
      expect(player1.getPrizeLeft()).toBe(5);
    });
  }

  it('does not offer recovery if Guts keeps the defender in play', () => {
    const { store, player1, player2, overridePrompt } = battle({
      active: { card: 'Honchkrow LV.X SW', energy: [dark, dark, dark] }, discard: [water]
    }, { active: { card: 'Heracross BUS', damage: 60 } });
    const candidate = player1.discard.cards[0];
    const confirm = jasmine.createSpy('confirm').and.returnValue(true);
    overridePrompt('Confirm', confirm);
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Darkness Wing'));
    expect(confirm).not.toHaveBeenCalled();
    expect(player1.discard.cards).toContain(candidate);
    expect(player2.active.damage).toBe(100);
  });
});

describe('Revenge Seed and Spiteful Spirit', () => {
  it('applies Revenge Seed before Weakness after the original Grass defender switches', () => {
    const { store, player1, player2, overridePrompt } = battle({ active: murkrow },
      { active: { card: 'Grookey SSH', damage: 50 }, bench: [shaymin] });
    player1.active.getPokemonCard()!.weakness = [{ type: CardType.GRASS }];
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Move energy', () => []);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    store.dispatch(new AttackAction(player2.id, 'Energy Flare'));
    const hit = store.state.logs.find(log => log.message === GameLog.LOG_PLAYER_DEALS_DAMAGE
      && log.params?.effect === 'Energy Flare');
    expect(hit?.params?.damage).toBe(220);
  });

  it('does not activate Revenge Seed after a direct Knock Out', () => {
    const { store, player1, player2, overridePrompt } = battle({
      active: { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] }
    }, { active: { card: 'Grookey SSH' }, bench: [shaymin] });
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Move energy', () => []);
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    store.dispatch(new AttackAction(player2.id, 'Energy Flare'));
    const hit = store.state.logs.find(log => log.message === GameLog.LOG_PLAYER_DEALS_DAMAGE
      && log.params?.effect === 'Energy Flare');
    expect(hit?.params?.damage).toBe(100);
  });

  it('confuses and poisons the attacker if Whirlwind moves the lethally damaged Jellicent', () => {
    const { store, player1, overridePrompt } = battle({ active: murkrow },
      { active: { card: 'Jellicent PLS', damage: 90 } });
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(player1.active.specialConditions).toEqual([SpecialCondition.CONFUSED, SpecialCondition.POISONED]);
  });

  it('does not transfer Spiteful Spirit to the replacement after Spinning Turn', () => {
    const { store, player1, overridePrompt } = battle({ active: { card: 'Donphan PLS', energy: [fighting] } },
      { active: { card: 'Jellicent PLS', damage: 90 } });
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Spinning Turn'));
    expect(player1.active.getPokemonCard()?.fullName).toBe('Mew ex MEW');
    expect(player1.active.specialConditions).toEqual([]);
    expect(player1.bench[0].specialConditions).toEqual([]);
  });
});

describe('Water Rescue', () => {
  const victim = { card: mantine, damage: 100, energy: [water] };

  it('does not recover a Water Pokémon directly Knocked Out by Frenzied Gouging', () => {
    const { store, player1, player2 } = battle({
      active: { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] }
    }, { active: { ...victim, damage: 0 }, bench: [floatzel] });
    const pokémon = player2.active.getPokemonCard()!;
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    expect(player2.discard.cards).toContain(pokémon);
    expect(player2.hand.cards).not.toContain(pokémon);
  });

  for (const accept of [false, true]) {
    it(`lets Floatzel's player ${accept ? 'recover the exact discarded cards' : 'decline recovery'} after Whirlwind`, () => {
      const { store, player1, player2, overridePrompt } = battle({ active: murkrow },
        { active: victim, bench: [floatzel], discard: [water] });
      const knockedOut = player2.active.cards.slice();
      const olderEnergy = player2.discard.cards[0];
      const confirm = jasmine.createSpy('confirm').and.returnValue(accept);
      overridePrompt('Choose pokemon', () => [ownBench]);
      overridePrompt('Confirm', confirm);
      store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(knockedOut.every(card => (accept ? player2.hand : player2.discard).cards.includes(card))).toBe(true);
      expect(player2.discard.cards).toContain(olderEnergy);
      expect(player1.getPrizeLeft()).toBe(5);
    });
  }

  it('resolves Lucky Egg before the Water Rescue choice', () => {
    const { store, player1, player2, overridePrompt } = battle({ active: murkrow },
      { active: { ...victim, tools: ['Lucky Egg AR'] }, bench: [floatzel] });
    const knockedOut = [...player2.active.cards, ...player2.active.tools];
    const prompt = store.prompt.bind(store);
    spyOn(store, 'prompt').and.callFake((...args: Parameters<typeof store.prompt>) => {
      const prompts = Array.isArray(args[1]) ? args[1] : [args[1]];
      if (prompts.some(item => item instanceof ConfirmPrompt && item.playerId === player2.id)) {
        expect(player2.hand.cards.length).toBe(7);
      }
      return prompt(...args);
    });
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Confirm', () => true);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(knockedOut.every(card => player2.hand.cards.includes(card))).toBe(true);
  });

  it('recovers an Evolution Pokémon that Aqua Effect gives the Water type', () => {
    const { store, player1, player2, overridePrompt } = battle({ active: murkrow }, {
      active: { card: 'Pidgeotto OBF', damage: 80 }, bench: [floatzel, { card: 'Vaporeon AOR' }]
    });
    const pokemon = player2.active.getPokemonCard()!;
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Confirm', () => true);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(player2.hand.cards).toContain(pokemon);
  });

  it('leaves Energy and the formerly Active Pokémon alone when Lost City redirects it', () => {
    const { store, player1, player2, overridePrompt } = battle({ active: murkrow, hand: ['Lost City LOR'] },
      { active: victim, bench: [floatzel] });
    const victimCard = player2.active.getPokemonCard()!;
    const confirm = jasmine.createSpy('confirm').and.returnValue(true);
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Confirm', confirm);
    store.dispatch(new PlayCardAction(player1.id, 0, { ...ownBench, slot: SlotType.BOARD }));
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(confirm).not.toHaveBeenCalled();
    expect(player2.lostzone.cards).toContain(victimCard);
    expect(player2.discard.cards.some(card => card.fullName === water)).toBe(true);
  });
});

describe("N's Zekrom Shred", () => {
  it('bypasses Critical Cut after Golisopod actually earns its protection', () => {
    const { store, player1, player2, overridePrompt } = battle(
      { active: { card: 'Golisopod M4', energy: [water] } },
      { active: { card: 'Rookidee SSH', damage: 30 }, bench: [zekrom] });
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Critical Cut'));
    expect(player1.active.preventDamageNextTurn).toBe(true);
    store.dispatch(new AttackAction(player2.id, 'Shred'));
    expect(player1.active.damage).toBe(70);
  });

  for (const [modifier, expected] of [['weakness', 140], ['resistance', 40]] as const) {
    it(`applies printed ${modifier} through Rigid Band`, () => {
      const { store, player1, player2 } = battle({ active: zekrom },
        { active: { card: 'Golisopod M4', tools: ['Rigid Band MEW'] } });
      const defender = player2.active.getPokemonCard()!;
      defender.weakness = modifier === 'weakness' ? [{ type: CardType.DRAGON }] : [];
      defender.resistance = modifier === 'resistance' ? [{ type: CardType.DRAGON, value: -30 }] : [];
      store.dispatch(new AttackAction(player1.id, 'Shred'));
      const hit = store.state.logs.find(log => log.message === GameLog.LOG_PLAYER_DEALS_DAMAGE
        && log.params?.effect === 'Shred');
      expect(hit?.params?.damage).toBe(expected);
    });
  }

  it('keeps the attacking Vitality Band boost through Intimidating Pattern', () => {
    const { store, player1, player2 } = battle({ active: zekrom, hand: ['Vitality Band SVI'] },
      { active: { card: 'Arbok SLG' } });
    store.dispatch(new PlayCardAction(player1.id, 0, { ...ownBench, slot: SlotType.ACTIVE }));
    store.dispatch(new AttackAction(player1.id, 'Shred'));
    expect(player2.active.damage).toBe(80);
  });

  for (const usesShred of [false, true]) {
    it(`Adrena-Pheromone applies correctly against ${usesShred ? 'Shred' : 'ordinary damage'}`, () => {
      const attacker = usesShred ? zekrom : { ...zekrom, card: 'Arceus V BRS' };
      const { store, player1, player2 } = battle({ active: attacker },
        { active: { card: 'Fezandipiti TWM', energy: [dark] } });
      spyOn(Math, 'random').and.returnValue(0.1);
      store.dispatch(new AttackAction(player1.id, usesShred ? 'Shred' : 'Power Edge'));
      expect(player2.active.damage).toBe(usesShred ? 70 : 0);
    });
  }

  for (const defender of ['Cornerstone Mask Ogerpon ex TWM', 'Mimikyu PAL']) {
    it(`bypasses ${defender}'s protection even when N's Zoroark copies Shred`, () => {
      const { store, player1, overridePrompt } = battle({
        active: { card: "N's Zoroark ex JTG", energy: [dark, dark] }, bench: [zekrom]
      }, { active: { card: defender } });
      overridePrompt('Choose attack', () => ({ index: 0, attack: 'Shred' }));
      store.dispatch(new AttackAction(player1.id, 'Night Joker'));
      const hit = store.state.logs.find(log => log.message === GameLog.LOG_PLAYER_DEALS_DAMAGE
        && log.params?.effect === 'Shred');
      expect(hit?.params?.damage).toBe(70);
    });
  }
});
