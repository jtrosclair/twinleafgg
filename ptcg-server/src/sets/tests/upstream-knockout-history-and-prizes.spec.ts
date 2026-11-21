import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, PlayCardAction, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { GameWinner, State } from '../../game/store/state/state';
import { PokemonSlotConfig, SetupGameConfig, padDeck, setupGame } from './test-helpers';

const dark = 'Darkness Energy SVE';
const grass = 'Grass Energy SVE';
const lightning = 'Lightning Energy SVE';
const metal = 'Metal Energy SVE';
const water = 'Water Energy SVE';
const mew = 'Mew ex MEW';
const rookidee = 'Rookidee SSH';
const skySealStone = 'Sky Seal Stone CRZ';
const beastBringer = 'Beast Bringer UNB';
const ultraBeast = 'Pheromosa & Buzzwole-GX UNB';
const arceusV = { card: 'Arceus V BRS', energy: [dark, dark, dark] };
const moon = { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] };
const murkrow = { card: 'Murkrow GRI', energy: [dark] };
const beautifly = { card: 'Beautifly LOT', energy: [grass] };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { ...ownBench, slot: SlotType.ACTIVE };
const board = { ...ownBench, slot: SlotType.BOARD };

function battle(
  active: PokemonSlotConfig, defender: PokemonSlotConfig,
  left: Partial<SetupGameConfig['player1']> = {},
  right: Partial<SetupGameConfig['player2']> = {},
) {
  return setupGame({
    turn: 5,
    player1: { active, bench: [{ card: mew }], deck: padDeck(16), ...left },
    player2: { active: defender, bench: [{ card: 'Radiant Greninja ASR' }], deck: padDeck(16), ...right }
  });
}

function checkFlips(store: ReturnType<typeof battle>['store'], results: boolean[]) {
  const reduce = store.reduceEffect.bind(store);
  spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    const next = reduce(state, effect);
    if (effect instanceof CoinFlipEffect && effect.result !== undefined) results.push(effect.result);
    return next;
  });
}

describe('Guts resolves before attack damage and the Knock Out check', () => {
  for (const { card, hp } of [{ card: 'Heracross BUS', hp: 110 }, { card: 'Hariyama FST 143', hp: 140 }]) {
    for (const heads of [true, false]) {
      it(`${card} resolves a lethal attack correctly on ${heads ? 'heads' : 'tails'}`, () => {
        const { store, player1, player2 } = battle(beautifly, { card, damage: hp - 30 });
        const flips: boolean[] = [];
        checkFlips(store, flips);
        spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
        store.dispatch(new AttackAction(player1.id, 'Butterfly Edge'));
        expect(flips).toEqual([heads]);
        expect(player1.active.preventDamageNextTurn).toBe(!heads);
        if (heads) {
          expect(player2.active.getPokemonCard()?.fullName).toBe(card);
          expect(player2.active.damage).toBe(hp - 10);
          expect(player1.getPrizeLeft()).toBe(6);
        } else {
          expect(player2.discard.cards.some(item => item.fullName === card)).toBe(true);
          expect(player1.getPrizeLeft()).toBe(5);
        }
      });
    }
  }

  it('skips the flip if damage is kept below lethal after damage reduction', () => {
    const { store, player1, player2 } = battle(beautifly, { card: 'Heracross BUS', damage: 80 });
    player2.active.damageReductionNextTurn = 10;
    const flips: boolean[] = [];
    checkFlips(store, flips);
    store.dispatch(new AttackAction(player1.id, 'Butterfly Edge'));
    expect(flips).toEqual([]);
    expect(player2.active.damage).toBe(100);
  });

  it('does not flip for a direct Knock Out', () => {
    const { store, player1, player2 } = battle(moon, { card: 'Heracross BUS' });
    const flips: boolean[] = [];
    checkFlips(store, flips);
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    expect(flips).toEqual([]);
    expect(player2.discard.cards.some(card => card.fullName === 'Heracross BUS')).toBe(true);
  });
});

describe('Attack-damage Knock Out history', () => {
  it('boosts Anchor Anger when Whirlwind puts a lethally damaged Grass Pokémon on the Bench', () => {
    const { store, player1, player2, overridePrompt } = battle(
      murkrow, { card: 'Grookey SSH', damage: 50 },
      {}, { bench: [{ card: 'Dhelmise V SSH', energy: [grass] }] });
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    store.dispatch(new AttackAction(player2.id, 'Anchor Anger'));
    expect(player1.discard.cards.some(card => card.fullName === murkrow.card)).toBe(true);
  });

  it('keeps Anchor Anger at 30 when the previous attack uses a direct Knock Out', () => {
    const { store, player1, player2, overridePrompt } = battle(
      { ...moon, tools: ['Ancient Booster Energy Capsule PAR'] }, { card: 'Grookey SSH' }, {}, { bench: [{ card: 'Dhelmise V SSH', energy: [grass] }] });
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    store.dispatch(new AttackAction(player2.id, 'Anchor Anger'));
    expect(player1.active.damage).toBe(260);
  });

  it('returns all attachments for Retribution after Whirlwind knocks out Escavalier', () => {
    const { store, player1, player2, overridePrompt } = battle(
      { ...murkrow, damage: 50, energy: [dark, water] }, { card: 'Escavalier PLB', damage: 90 },
      {}, { bench: [{ card: 'Accelgor PLB', energy: [water] }] });
    const [mirrored, secondaryOnly] = player1.active.energies.cards;
    player1.active.cards = player1.active.cards.filter(card => card !== secondaryOnly);
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    store.dispatch(new AttackAction(player2.id, 'Retribution'));
    expect(player1.hand.cards.filter(card => card === mirrored || card === secondaryOnly))
      .toEqual([mirrored, secondaryOnly]);
    expect(player1.discard.cards.some(card => card.fullName === murkrow.card)).toBe(true);
  });
});

describe('Robo Substitute discard', () => {
  for (const card of ['Robo Substitute PHF', 'Robo Substitute Team Flare Gear PHF']) {
    it(`discards Benched ${card} with its attachments and leaves the Active effects intact`, () => {
      const { store, player1 } = battle({ card: mew }, { card: rookidee }, {
        bench: [{ card, damage: 10, tools: ['Air Balloon SSH'], energy: [water] }, { card: rookidee }]
      });
      player1.active.specialConditions.push(SpecialCondition.POISONED);
      const slot = player1.bench[0];
      const doll = slot.getPokemonCard()!;
      const attachments = [slot.tools[0], slot.energies.cards[0]];
      store.dispatch(new UseAbilityAction(player1.id, 'Robo Substitute', ownBench));
      expect(player1.active.getPokemonCard()?.fullName).toBe(mew);
      expect(player1.active.specialConditions).toEqual([SpecialCondition.POISONED]);
      expect(player1.discard.cards).toContain(doll);
      for (const attachment of attachments) {
        expect(player1.discard.cards.filter(card => card === attachment).length).toBe(1);
      }
      expect(slot.cards).toEqual([]);
      expect(slot.damage).toBe(0);
    });
  }

  it('promotes the chosen Pokémon after the Active Robo Substitute is discarded', () => {
    const { store, player1, player2, overridePrompt } = battle(
      { card: 'Robo Substitute PHF' }, { card: rookidee }, { bench: [{ card: mew }, { card: 'Grookey SSH' }] });
    const doll = player1.active.getPokemonCard()!;
    overridePrompt('Choose pokemon', () => [{ ...ownBench, index: 1 }]);
    store.dispatch(new UseAbilityAction(player1.id, 'Robo Substitute', ownActive));
    expect(player1.discard.cards).toContain(doll);
    expect(player1.active.getPokemonCard()?.fullName).toBe('Grookey SSH');
    expect(player2.getPrizeLeft()).toBe(6);
  });

  it('discards the only Pokémon and ends the game without awarding Prizes', () => {
    const { store, player1, player2 } = battle({ card: 'Robo Substitute PHF' }, { card: rookidee }, { bench: [] });
    const doll = player1.active.getPokemonCard()!;
    store.dispatch(new UseAbilityAction(player1.id, 'Robo Substitute', ownActive));
    expect(player1.discard.cards).toContain(doll);
    expect(player1.deck.cards).not.toContain(doll);
    expect(player2.getPrizeLeft()).toBe(6);
    expect(store.state.winner).toBe(GameWinner.PLAYER_2);
  });
});

describe('Extra Prizes from attack damage', () => {
  it('awards Star Order after another Basic V attacks, even if the Tool was discarded', () => {
    const { store, player1, overridePrompt } = battle(
      { card: 'Arceus VSTAR BRS' }, { card: 'Arceus VSTAR BRS', damage: 150 },
      { bench: [arceusV], hand: [skySealStone, 'Lost Vacuum LOR', 'Switch SVI', dark] });
    store.dispatch(new PlayCardAction(player1.id, 0, ownActive));
    const tool = player1.active.tools[0];
    store.dispatch(new UseAbilityAction(player1.id, 'Star Order', ownActive));
    expect(player1.usedVSTAR).toBe(true);
    overridePrompt('Choose cards', () => [1]);
    overridePrompt('Choose pokemon', () => [ownActive]);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(player1.lostzone.cards).toContain(tool);
    overridePrompt('Choose pokemon', () => [ownBench]);
    const switchIndex = player1.hand.cards.findIndex(card => card.fullName === 'Switch SVI');
    store.dispatch(new PlayCardAction(player1.id, switchIndex, board));
    store.dispatch(new AttackAction(player1.id, 'Power Edge'));
    expect(player1.getPrizeLeft()).toBe(3);
  });

  it('awards Star Order just once with a Tool mirrored in both legacy lists', () => {
    const { store, player1 } = battle(
      { ...arceusV, tools: [skySealStone] }, { card: 'Arceus VSTAR BRS', damage: 150 });
    expect(player1.active.cards).toContain(player1.active.tools[0]);
    store.dispatch(new UseAbilityAction(player1.id, 'Star Order', ownActive));
    store.dispatch(new AttackAction(player1.id, 'Power Edge'));
    expect(player1.getPrizeLeft()).toBe(3);
  });

  it('expires Star Order before the following turn', () => {
    const { store, player1, player2 } = battle(
      arceusV, { card: 'Arceus VSTAR BRS', damage: 150 }, { hand: [skySealStone] });
    store.dispatch(new PlayCardAction(player1.id, 0, ownActive));
    store.dispatch(new UseAbilityAction(player1.id, 'Star Order', ownActive));
    store.dispatch(new PassTurnAction(player1.id));
    store.dispatch(new PassTurnAction(player2.id));
    store.dispatch(new AttackAction(player1.id, 'Power Edge'));
    expect(player1.getPrizeLeft()).toBe(4);
  });

  it('ignores a Benched Beast Bringer when Miraidon Knocks Out the opponent', () => {
    const { store, player1 } = battle(
      { card: 'Miraidon ex SVI', energy: [lightning, lightning, dark] }, { card: 'Dedenne GX UNB' },
      { bench: [{ card: ultraBeast, tools: [beastBringer] }] });
    store.dispatch(new AttackAction(player1.id, 'Photon Blaster'));
    expect(player1.getPrizeLeft()).toBe(4);
  });

  for (const prizeCount of [6, 5]) {
    it(`counts Beast Bringer once for a qualifying attack starting with exactly ${prizeCount} Prizes`, () => {
      const { store, player1, overridePrompt } = battle(
        { card: ultraBeast, energy: [grass], tools: [beastBringer] },
        { card: 'Dedenne GX UNB', damage: 130 }, { prizeCount });
      overridePrompt('Choose pokemon', () => [{ ...ownBench, player: PlayerType.TOP_PLAYER }]);
      store.dispatch(new AttackAction(player1.id, 'Jet Punch'));
      expect(player1.getPrizeLeft()).toBe(prizeCount - (prizeCount === 6 ? 3 : 2));
    });
  }

  const adp = { card: 'Arceus & Dialga & Palkia GX CEC', energy: [metal, water] };

  it('does not award the Altered Creation bonus for Frenzied Gouging', () => {
    const { store, player1, player2, overridePrompt } = battle(
      adp, { card: rookidee }, { bench: [moon], hand: ['Switch SVI'] });
    store.dispatch(new AttackAction(player1.id, 'Altered Creation-GX'));
    expect(player1.usedAlteredCreation).toBe(true);
    store.dispatch(new PassTurnAction(player2.id));
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    expect(player1.getPrizeLeft()).toBe(5);
  });

  it('keeps Altered Creation after its source leaves play and counts a switched defender', () => {
    const { store, player1, player2, overridePrompt } = battle(
      adp, { card: rookidee, damage: 20 }, { bench: [murkrow] }, {
        hand: ['Lost City LOR'], bench: [moon, { card: mew }]
      });
    store.dispatch(new AttackAction(player1.id, 'Altered Creation-GX'));
    overridePrompt('Choose pokemon', () => [ownBench]);
    player2.switchPokemon(player2.bench[0], store, store.state);
    store.dispatch(new PlayCardAction(player2.id, 0, board));
    store.dispatch(new AttackAction(player2.id, 'Frenzied Gouging'));
    expect(player1.lostzone.cards.some(card => card.fullName === adp.card)).toBe(true);
    player2.switchPokemon(player2.bench[0], store, store.state);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(player2.lostzone.cards.some(card => card.fullName === rookidee)).toBe(true);
    expect(player1.getPrizeLeft()).toBe(4);
  });

  it('clears the damage and Prize bonuses when the opponent plays Pokémon Ranger', () => {
    const { store, player1, player2 } = battle(adp, { card: rookidee }, { bench: [murkrow] }, {
      hand: ['Pokemon Ranger STS']
    });
    store.dispatch(new AttackAction(player1.id, 'Altered Creation-GX'));
    store.dispatch(new PlayCardAction(player2.id, 0, board));
    expect(player1.usedAlteredCreation).toBe(false);
    expect(player1.alteredCreationDamage).toBe(false);
    expect(player1.usedGX).toBe(true);
  });
});
