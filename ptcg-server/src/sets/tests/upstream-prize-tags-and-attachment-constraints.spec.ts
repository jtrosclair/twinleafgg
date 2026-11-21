import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardTag, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { GameMessage } from '../../game/game-message';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const lightning = 'Lightning Energy SVE';
const fire = 'Fire Energy SVE';
const fighting = 'Fighting Energy SVE';
const metal = 'Metal Energy SVE';
const fairy = 'Fairy Energy XY';
const spare = { card: 'Rookidee SSH' };
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };

function game(left: PlayerConfig, right: PlayerConfig = { active: spare }) {
  return setupGame({
    turn: 5, player1: { bench: [spare, spare], deck: padDeck(16), ...left },
    player2: { bench: [spare], deck: padDeck(16), ...right }
  });
}

const prints: ReadonlyArray<readonly [name: string, set: string, number: string, prizes: number]> = [
  ["Team Rocket's Kangaskhan ex ASC", 'ASC', '162', 2],
  ["Stunfisk ex FA ASC", 'ASC', '252', 2],
  ["Pikachu ex SIR ASC", 'ASC', '276', 2],
  ["Koraidon ex ASC", 'ASC', '121', 2],
  ["Mandibuzz ex ASC", 'ASC', '139', 2],
  ["Stunfisk ex ASC", 'ASC', '114', 2],
  ["Togedemaru ex ASC", 'ASC', '149', 2],
  ["Voltorb ex ASC", 'ASC', '58', 2],
  ["Beedrill ex M4 3", 'CRI', '3', 2],
  ["Cinccino ex M4 73", 'CRI', '73', 2],
  ["Cobalion ex M4 64", 'CRI', '64', 2],
  ["Gourgeist ex M4 41", 'CRI', '41', 2],
  ["Mega Dragalge ex M4 65", 'CRI', '65', 3],
  ["Mega Floette ex M4 35", 'CRI', '35', 3],
  ["Mega Greninja ex M4 22", 'CRI', '22', 3],
  ["Mega Pyroar ex M4 15", 'CRI', '15', 3],
  ["Eevee ex MEE", 'MEE', '9', 2],
  ["Mega Heatran ex M-P", 'M-P', '169', 3],
  ["Mega Tatsugiri ex M-P", 'M-P', '139', 3],
  ["Pikachu ex2 MEP", 'MEP', '109', 2],
  ["Pikachu ex MEP", 'MEP', '107', 2],
  ["Armaldo ex P1", 'P1', '16', 2],
  ["Tyranitar ex P1", 'P1', '17', 2],
  ["Ho-Oh ex P3", 'P3', '17', 2],
  ["Dedenne ex PAL", 'PAL', '93', 2],
  ["Maushold ex PAR", 'PAR', '155', 2],
  ["Toxtricity ex SVP 215", 'SVP', '215', 2],
  ["Pikachu ex PR-SV", 'SVP', '106', 2],
  ["Ho-Oh V SIT 140", 'SIT', '140', 2],
  ["Tsareena-GX SMP", 'SMP', '56', 2],
  ["Iron Boulder ex TEF", 'TEF', '99', 2],
  ["Salamence-EX XYP", 'XYP', '170', 2],
];

describe('Rule Box Prize counts on registered printings', () => {
  for (const [name, set, number, prizes] of prints) {
    it(`awards ${prizes} Prizes for ${name} ${number} after a real attack`, () => {
      spyOn(Math, 'random').and.returnValue(0.99);
      const { store, player1, player2, overridePrompt } = game({
        active: { card: 'Gholdengo ex PAR', energy: [metal] }, hand: Array(12).fill(metal)
      }, { active: { card: name } });
      const target = player2.active.getPokemonCard()!;
      expect(target.set).toBe(set);
      expect(target.setNumber).toBe(number);
      if (prizes === 3) expect(target.tags).toContain(CardTag.POKEMON_SV_MEGA);
      expect(target.tags.some(tag => [CardTag.POKEMON_ex, CardTag.POKEMON_EX, CardTag.POKEMON_GX, CardTag.POKEMON_V]
        .some(prizeTag => prizeTag === tag))).toBe(true);
      overridePrompt('Choose cards', () => Array.from({ length: 12 }, (_, index) => index));
      store.dispatch(new AttackAction(player1.id, 'Make It Rain'));
      expect(player2.discard.cards.includes(target)).toBe(true);
      expect(player1.getPrizeLeft()).toBe(6 - prizes);
    });
  }

  it('keeps the other printed classifications on the same definitions', () => {
    expect(getCardByName("Team Rocket's Kangaskhan ex ASC").tags).toContain(CardTag.TEAM_ROCKET);
    expect(getCardByName('Iron Boulder ex TEF').tags).toContain(CardTag.FUTURE);
    expect(getCardByName('Koraidon ex ASC').tags).toContain(CardTag.POKEMON_TERA);
    expect(getCardByName('Dedenne ex PAL').tags).toContain(CardTag.POKEMON_TERA);
  });
});

describe('Energy prompt selections under printed restrictions', () => {
  it('rejects an off-type attachment for Never Give Up before moving the card', () => {
    const { store, player1, overridePrompt } = game({
      active: { card: 'Raichu UNB', energy: [water] }, discard: [water, lightning]
    }, { active: spare, prizeCount: 3 });
    const [wrong, eligible] = player1.discard.cards;
    overridePrompt('Attach energy', () => [{ index: 0, to: active }]);
    expect(() => store.dispatch(new AttackAction(player1.id, 'Never Give Up'))).toThrow();
    expect(player1.discard.cards).toEqual([wrong, eligible]);
  });

  for (const duplicateType of [true, false]) {
    it(`Tar Generator ${duplicateType ? 'rejects two of the same type' : 'accepts one Fire and one Fighting'}`, () => {
      const { store, player1, overridePrompt } = game({
        active: { card: 'Coalossal RCL' }, discard: [fire, fire, fighting]
      });
      const selected = [player1.discard.cards[0], player1.discard.cards[duplicateType ? 1 : 2]];
      overridePrompt('Attach energy', () => [{ index: 0, to: active }, { index: duplicateType ? 1 : 2, to: bench }]);
      const activate = () => store.dispatch(new UseAbilityAction(player1.id, 'Tar Generator', active));
      if (duplicateType) expect(activate).toThrow();
      else activate();
      expect(player1.active.cards.includes(selected[0])).toBe(!duplicateType);
      expect(player1.bench[0].cards.includes(selected[1])).toBe(!duplicateType);
    });
  }

  for (const sameTarget of [true, false]) {
    it(`Geomancy ${sameTarget ? 'rejects two attachments to one Bench slot' : 'attaches to two different Bench slots'}`, () => {
      const { store, player1, overridePrompt } = game({
        active: { card: 'Xerneas STS', energy: [fairy] }, deck: [fairy, fairy, ...padDeck(16)]
      });
      const selected = player1.deck.cards.slice(0, 2);
      overridePrompt('Attach energy', () => [{ index: 0, to: bench }, { index: 1, to: { ...bench, index: sameTarget ? 0 : 1 } }]);
      const attack = () => store.dispatch(new AttackAction(player1.id, 'Geomancy'));
      if (sameTarget) expect(attack).toThrow();
      else attack();
      expect(player1.bench[0].cards.includes(selected[0])).toBe(!sameTarget);
      expect(player1.bench[1].cards.includes(selected[1])).toBe(!sameTarget);
    });
  }

  for (const exceedsLimit of [true, false]) {
    it(`Jolting Charge ${exceedsLimit ? 'cannot attach three of one type' : 'can attach two Lightning and two Grass to one Pokémon'}`, () => {
      const { store, player1, overridePrompt } = game({
        active: { card: 'Joltik SCR', energy: [water] }, deck: [grass, grass, lightning, lightning, grass, ...padDeck(16)]
      });
      const selected = player1.deck.cards.slice(0, 4);
      overridePrompt('Attach energy', () => (exceedsLimit ? [0, 1, 2, 4] : [0, 1, 2, 3]).map(index => ({ index, to: bench })));
      const attack = () => store.dispatch(new AttackAction(player1.id, 'Jolting Charge'));
      if (exceedsLimit) expect(attack).toThrow();
      else attack();
      expect(selected.every(card => player1.bench[0].cards.includes(card))).toBe(!exceedsLimit);
      expect(selected.every(card => player1.deck.cards.includes(card))).toBe(exceedsLimit);
    });
  }

  it('understands legacy cardType and provides filters and validates original list membership', () => {
    const { player1, state } = game({ active: spare, discard: [water, fire, 'Double Turbo Energy BRS'] });
    const choose = (filter: ConstructorParameters<typeof AttachEnergyPrompt>[5]) => new AttachEnergyPrompt(
      player1.id, GameMessage.ATTACH_ENERGY_CARDS, player1.discard, PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE], filter, { min: 1, max: 1 }
    );
    const byType = choose({ superType: SuperType.ENERGY, cardType: CardType.WATER, energyType: EnergyType.BASIC });
    const byProvides = choose({ superType: SuperType.ENERGY, provides: [CardType.WATER] });
    for (const prompt of [byType, byProvides]) {
      expect(prompt.validate(prompt.decode([{ index: 0, to: active }], state))).toBe(true);
      expect(prompt.validate(prompt.decode([{ index: 1, to: active }], state))).toBe(false);
      expect(prompt.validate([{ card: getCardByName(water), to: active }])).toBe(false);
    }
  });
});
