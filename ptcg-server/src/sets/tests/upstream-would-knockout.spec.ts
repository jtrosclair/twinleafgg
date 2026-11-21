import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const fighting = 'Fighting Energy SVE';
const fire = 'Fire Energy SVE';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const psychic = 'Psychic Energy SVE';
const arceus = { card: 'Arceus V BRS', energy: [water, water, water] };
const rookidee = { card: 'Rookidee SSH' };
const kingler = { card: 'Kingler GE', energy: [water, water, water] };
const machamp = { card: 'Machamp LV.X SF', energy: [fighting, fire, fire] };
const honchkrow = { card: 'Honchkrow LV.X SW', energy: [dark, dark, dark] };
const alternateGolisopod = { card: 'Golisopod M4 26', energy: [water, water, water] };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { ...ownBench, slot: SlotType.ACTIVE };

function battle(left: PlayerConfig, right: PlayerConfig) {
  return setupGame({
    turn: 5,
    player1: { bench: [{ card: 'Mew ex MEW' }], deck: padDeck(16), ...left },
    player2: { bench: [arceus], deck: padDeck(16), ...right }
  });
}

describe('Scissor Blow recoil', () => {
  it('deals 30 recoil after a Knock Out', () => {
    const { store, player1 } = battle({ active: kingler }, { active: rookidee });
    store.dispatch(new AttackAction(player1.id, 'Scissor Blow'));
    expect(player1.active.damage).toBe(30);
    expect(player1.getPrizeLeft()).toBe(5);
  });

  it('does not recoil on a nonlethal hit', () => {
    const { store, player1, player2 } = battle({ active: kingler }, { active: arceus });
    store.dispatch(new AttackAction(player1.id, 'Scissor Blow'));
    expect(player2.active.damage).toBe(80);
    expect(player1.active.damage).toBe(0);
  });

  it('still recoils if a survival effect saves the defender from lethal damage', () => {
    const { store, player1, player2 } = battle({ active: kingler }, { active: { card: 'Heracross BUS', damage: 40 } });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Scissor Blow'));
    expect(player2.active.damage).toBe(100);
    expect(player1.active.damage).toBe(30);
    expect(player1.getPrizeLeft()).toBe(6);
  });

  it('takes the Prizes for Kingler and the defender when both are Knocked Out', () => {
    const { store, player1, player2 } = battle({ active: { ...kingler, damage: 60 } }, { active: rookidee });
    const attacker = player1.active.getPokemonCard()!;
    store.dispatch(new AttackAction(player1.id, 'Scissor Blow'));
    expect(player1.discard.cards).toContain(attacker);
    expect(player1.getPrizeLeft()).toBe(5);
    expect(player2.getPrizeLeft()).toBe(5);
  });

  it('applies the copying Mew ex’s own Psychic Weakness to recoil', () => {
    const { store, player1, player2, overridePrompt } = battle({
      active: { card: 'Mew ex LM', energy: [water, water, water] }
    }, { active: { ...kingler, damage: 10 } });
    overridePrompt('Choose attack', prompt => ({
      index: (prompt as ChooseAttackPrompt).cards.findIndex(card => card.fullName === kingler.card),
      attack: 'Scissor Blow'
    }));
    store.dispatch(new UseAbilityAction(player1.id, 'Versatile', ownActive));
    expect(player1.active.damage).toBe(60);
    expect(player2.discard.cards.some(card => card.fullName === kingler.card)).toBe(true);
  });
});

describe('Strong-Willed and Darkness Wing', () => {
  for (const heads of [true, false]) {
    it(`resolves Strong-Willed on ${heads ? 'heads' : 'tails'} and still offers Darkness Wing recovery`, () => {
      const { store, player1, player2, overridePrompt } = battle({
        active: { ...machamp, damage: 40 }
      }, { active: honchkrow, discard: [fire] });
      const candidate = player2.discard.cards[0];
      spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      store.dispatch(new AttackAction(player1.id, 'Strong-Willed'));
      expect(player2.active.damage).toBe(60);
      expect(store.state.logs.some(log => log.message === GameLog.LOG_PLAYER_FLIPS_HEADS
        || log.message === GameLog.LOG_PLAYER_FLIPS_TAILS)).toBe(false);
      overridePrompt('Confirm', () => true);
      overridePrompt('Choose cards', () => [0]);
      store.dispatch(new AttackAction(player2.id, 'Darkness Wing'));
      expect(player2.hand.cards).toContain(candidate);
      expect(player2.getPrizeLeft()).toBe(heads ? 6 : 5);
      if (heads) expect(player1.active.damage).toBe(140);
      const flip = store.state.logs.find(log => log.message === (heads ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS));
      expect(flip?.params?.name).toBe(player1.name);
    });
  }

  it('clears Strong-Willed when Whirlwind switches the defender before the Knock Out', () => {
    const { store, player1, player2, overridePrompt } = battle({
      active: { ...machamp, damage: 80 }
    }, { active: { card: 'Murkrow GRI', energy: [dark], tools: ['Luxurious Cape PAR'] } });
    const defender = player1.active.getPokemonCard()!;
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Strong-Willed'));
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player2.id, 'Whirlwind'));
    expect(player1.discard.cards).toContain(defender);
    expect(player2.getPrizeLeft()).toBe(5);
    expect(store.state.logs.some(log => log.message === GameLog.LOG_PLAYER_FLIPS_HEADS)).toBe(false);
  });

  it('gives a copied Strong-Willed to the Pokémon that used it', () => {
    const { store, player1, player2, overridePrompt } = battle({
      active: { card: 'Mew ex MEW', energy: [water, water, water], damage: 140 }
    }, { active: machamp });
    spyOn(Math, 'random').and.returnValue(0.1);
    overridePrompt('Choose attack', () => ({ index: 0, attack: 'Strong-Willed' }));
    store.dispatch(new AttackAction(player1.id, 'Genome Hacking'));
    store.dispatch(new AttackAction(player2.id, 'Strong-Willed'));
    expect(player1.active.getPokemonCard()?.fullName).toBe('Mew ex MEW');
    expect(player1.active.damage).toBe(170);
    expect(player2.getPrizeLeft()).toBe(6);
  });

  it('expires Strong-Willed after the opposing turn passes without a lethal hit', () => {
    const { store, player1, player2 } = battle({ active: machamp }, { active: honchkrow });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Strong-Willed'));
    store.dispatch(new PassTurnAction(player2.id));
    store.dispatch(new PassTurnAction(player1.id));
    player1.active.damage = 40;
    store.dispatch(new AttackAction(player2.id, 'Darkness Wing'));
    expect(player2.getPrizeLeft()).toBe(5);
  });

  it('adds No Guard before Weakness and to recoil on inherited Submission', () => {
    const { store, player1, player2 } = battle({ active: { ...machamp, tools: ['Memory Berry PL'] } }, { active: arceus });
    const stack = ['Machop PK', 'Machoke SF', 'Machamp SF'].map((name, index) => {
      const card = getCardByName(name);
      card.id = 20000 + index;
      return card;
    });
    player1.active.cards.unshift(...stack);
    store.dispatch(new AttackAction(player1.id, 'Submission'));
    expect(player2.active.damage).toBe(180);
    expect(player1.active.damage).toBe(70);
  });

  it('applies both No Guard effects when the two Active Pokémon are Machamp LV.X', () => {
    const { store, player1, player2 } = battle({ active: machamp }, { active: machamp });
    store.dispatch(new AttackAction(player1.id, 'Strong-Willed'));
    expect(player2.active.damage).toBe(140);
  });

  it('applies No Guard once to incoming damage after Weakness and Resistance', () => {
    const { store, player1 } = battle({
      active: { card: 'Hypno MEW', energy: [psychic, psychic, psychic] }
    }, { active: machamp });
    const original = player1.active.getPokemonCard()!;
    const attack = original.attacks[0];
    store.dispatch(new AttackAction(player1.id, attack.name));
    const hit = store.state.logs.find(log => log.message === GameLog.LOG_PLAYER_DEALS_DAMAGE
      && log.params?.effect === attack.name);
    expect(hit?.params?.damage).toBe(attack.damage + 40 + 60);
  });
});

describe('Critical Slash on Golisopod M4 26', () => {
  for (const retaliatesWith of ['Power Edge', 'Frenzied Gouging']) {
    it(`protects the alternate print from ${retaliatesWith} after a Knock Out and expires that turn`, () => {
      const enemy = retaliatesWith === 'Power Edge' ? arceus : { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] };
      const { store, player1, player2 } = battle({ active: alternateGolisopod },
        { active: { ...rookidee, damage: 30 }, bench: [enemy] });
      store.dispatch(new AttackAction(player1.id, 'Critical Slash'));
      expect(player1.active.preventDamageNextTurn).toBe(true);
      expect(player1.active.preventEffectsOfAttacksNextTurn).toBe(true);
      store.dispatch(new AttackAction(player2.id, retaliatesWith));
      expect(player1.active.getPokemonCard()?.fullName).toBe(alternateGolisopod.card);
      expect(player1.active.damage).toBe(0);
      expect(player1.active.preventDamageNextTurn).toBe(false);
      expect(player1.active.preventEffectsOfAttacksNextTurn).toBe(false);
    });
  }

  it('does not protect the alternate print when Guts prevents the Knock Out', () => {
    const { store, player1, player2 } = battle({ active: alternateGolisopod },
      { active: { card: 'Heracross BUS', damage: 80 } });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Critical Slash'));
    expect(player2.active.damage).toBe(100);
    expect(player1.active.preventDamageNextTurn).toBe(false);
    expect(player1.active.preventEffectsOfAttacksNextTurn).toBe(false);
  });

  it('gives copied Critical Slash protection to the actual attacker', () => {
    const { store, player1, overridePrompt } = battle({
      active: { card: 'Mew ex MEW', energy: [dark, dark, dark] }
    }, { active: { ...alternateGolisopod, damage: 110 } });
    overridePrompt('Choose attack', () => ({ index: 0, attack: 'Critical Slash' }));
    store.dispatch(new AttackAction(player1.id, 'Genome Hacking'));
    expect(player1.active.preventDamageNextTurn).toBe(true);
    expect(player1.active.preventEffectsOfAttacksNextTurn).toBe(true);
  });

  it('Boundless Power prevents another attack next turn', () => {
    const { store, player1, player2 } = battle({ active: alternateGolisopod }, { active: arceus });
    store.dispatch(new AttackAction(player1.id, 'Boundless Power'));
    store.dispatch(new PassTurnAction(player2.id));
    expect(() => store.dispatch(new AttackAction(player1.id, 'Critical Slash'))).toThrow(
      jasmine.objectContaining({ message: GameMessage.BLOCKED_BY_EFFECT })
    );
  });

  it('lets Shred through the old saved protection marker on Golisopod M4', () => {
    const { store, player1, player2 } = battle({
      active: { card: "N's Zekrom M2a", energy: [dark, dark, dark] }
    }, { active: { card: 'Golisopod M4' } });
    player2.active.marker.addMarker('GOLISOPOD_M4_INVULN_MARKER', player2.active.getPokemonCard()!);
    store.dispatch(new AttackAction(player1.id, 'Shred'));
    expect(player2.active.damage).toBe(70);
  });
});
