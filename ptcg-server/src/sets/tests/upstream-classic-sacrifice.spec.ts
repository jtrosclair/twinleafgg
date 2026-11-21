import { ensureClientCards } from '../../client/cards';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';
import { PutDamagePrompt } from '../../game/store/prompts/put-damage-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { GameWinner, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const active: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = (index = 0): CardTarget => ({ ...active, slot: SlotType.BENCH, index });
const theirActive = { ...active, player: PlayerType.TOP_PLAYER };
const enemyBench = (index: number): CardTarget => ({ ...bench(index), player: PlayerType.TOP_PLAYER });
const lightning = 'Lightning Energy SVE';
const metal = 'Metal Energy SVE';
const fighting = 'Fighting Energy SVE';
const fire = 'Fire Energy SVE';
const double = 'Double Colorless Energy BS';
const potion = 'Potion BS';
const lugia = 'Lugia V SIT';
const blissey = 'Blissey V CRE';
const pikachu = 'Pikachu ex SSP';
const electrodeEx = 'Electrode ex RG';
const electrodeTm = 'Electrode TM';
const electrodeViv = 'Electrode VIV';
const forretress = 'Forretress VIV';
const metalCost = [metal, metal, double];

beforeAll(ensureClientCards);

describe('Classic printed self-Knock Out effects', () => {
  let store: Store;
  afterEach(() => store?.cleanup());

  function start(left: PlayerConfig, right: PlayerConfig = { active: { card: blissey } }) {
    const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...left },
      player2: { deck: padDeck(8), ...right } });
    game.store.cleanup();
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    return game;
  }

  function pending() {
    return store.state.prompts.find(prompt => prompt.result === undefined);
  }

  function resolve(raw: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('Expected a pending prompt');
    const decoded = prompt.decode(raw, store.state);
    if (!prompt.validate(decoded, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
    store.dispatch(new ResolvePromptAction(prompt.id, decoded));
  }

  function finishAnimation() {
    while (pending() instanceof WaitPrompt) resolve(true);
  }

  function observeKnockOuts() {
    const events: { player: number; damage: number }[] = [];
    const reduce = store.reduceEffect.bind(store);
    spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof KnockOutEffect) events.push({ player: effect.player.id, damage: effect.target.damage });
      return reduce(state, effect);
    });
    return events;
  }

  for (const previouslyDiscarded of [1, 5, 6]) {
    it(`Extra Energy Bomb discards the full stack before choosing from ${previouslyDiscarded + 1} Energy`, () => {
      const { player1, player2 } = start({
        active: { card: electrodeEx, energy: [lightning], tools: ['Exp. Share SVI'], damage: 20 },
        bench: [{ card: lugia }, { card: pikachu }, { card: blissey }],
        discard: Array(previouslyDiscarded).fill(fire),
      });
      const source = player1.active.getPokemonCard()!;
      const [attached] = player1.active.energies.cards;
      const [tool] = player1.active.tools;
      const knockOuts = observeKnockOuts();
      store.dispatch(new UseAbilityAction(player1.id, 'Extra Energy Bomb', active));
      const prompt = pending() as AttachEnergyPrompt;
      expect(prompt instanceof AttachEnergyPrompt).toBe(true);
      expect(player1.active.cards).toEqual([]);
      expect(player1.discard.cards).toContain(source);
      expect(player1.discard.cards).toContain(tool);
      expect(prompt.cardList.cards).toContain(attached);
      expect(player2.getPrizeLeft()).toBe(6);
      expect(prompt.options.blockedTo).toEqual([bench(1)]);
      const count = Math.min(5, previouslyDiscarded + 1);
      expect(prompt.options.min).toBe(count);
      expect(prompt.options.max).toBe(count);
      expect(prompt.validate([])).toBe(false);
      const indices = [prompt.cardList.cards.indexOf(attached), ...Array.from({ length: count - 1 }, (_, i) => i)];
      resolve(indices.map((index, i) => ({ index, to: i === 0 ? bench() : bench(2) })));
      expect(knockOuts).toEqual([{ player: player1.id, damage: 20 }]);
      expect(player1.bench[0].energies.cards).toContain(attached);
      expect(player1.bench[2].energies.cards.length).toBe(count - 1);
      expect(player2.getPrizeLeft()).toBe(4);
      expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
      resolve([bench()]);
      expect(player1.active.getPokemonCard()?.fullName).toBe(lugia);
    });
  }

  it('finishes Extra Energy Bomb before awarding the final Prizes', () => {
    const { player1, player2 } = start({ active: { card: lugia },
      bench: [{ card: electrodeEx, energy: [fire] }] }, { active: { card: blissey }, prizeCount: 2 });
    store.dispatch(new UseAbilityAction(player1.id, 'Extra Energy Bomb', bench()));
    expect(player2.getPrizeLeft()).toBe(2);
    const prompt = pending() as AttachEnergyPrompt;
    resolve([{ index: prompt.cardList.cards.findIndex(card => card.fullName === fire), to: active }]);
    expect(player1.active.energies.cards[0].fullName).toBe(fire);
    expect(player2.getPrizeLeft()).toBe(0);
    expect(store.state.winner).toBe(GameWinner.PLAYER_2);
  });

  it('does not open an impossible Extra Energy Bomb assignment when every remaining Pokémon is ex', () => {
    const { player1, player2 } = start({
      active: { card: pikachu }, bench: [{ card: electrodeEx, energy: [fire] }],
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Extra Energy Bomb', bench()));
    expect(player2.getPrizeLeft()).toBe(4);
    expect(player1.active.energies.cards).toEqual([]);
    expect(pending()).toBeUndefined();
  });

  for (const [card, power] of [[electrodeEx, 'Extra Energy Bomb'], [electrodeTm, 'Energymite']]) {
    it(`${power} cannot be used by a Poisoned Active`, () => {
      const { player1 } = start({ active: { card }, bench: [{ card: lugia }] });
      player1.active.specialConditions.push(SpecialCondition.POISONED);
      expect(() => store.dispatch(new UseAbilityAction(player1.id, power, active))).toThrow();
      expect(pending()).toBeUndefined();
    });
  }

  for (const selected of [false, true]) {
    it(`Crush and Burn deals ${selected ? 50 : 30} damage with an optional physical Energy discard`, () => {
      const { player1, player2 } = start({ active: { card: electrodeEx, energy: [lightning, fire] },
        bench: [{ card: lugia, energy: [double] }] });
      store.dispatch(new AttackAction(player1.id, 'Crash and Burn'));
      finishAnimation();
      expect(pending() instanceof DiscardEnergyPrompt).toBe(true);
      const energy = player1.bench[0].energies.cards[0];
      resolve(selected ? [{ from: bench(), index: player1.bench[0].cards.indexOf(energy) }] : []);
      finishAnimation();
      expect(player2.active.damage).toBe(selected ? 50 : 30);
      expect(player1.discard.cards.includes(energy)).toBe(selected);
      expect(player1.active.energies.cards.length).toBe(2);
    });
  }

  it('Energymite can attach Special Energy before the Active Knock Out and discards all unselected cards', () => {
    const { player1, player2 } = start({ active: { card: electrodeTm, damage: 30 },
      bench: [{ card: lugia }], deck: [lightning, potion, potion, double, potion, fire, potion, metal, potion] });
    const deck = player1.deck.cards.slice();
    const knockOuts = observeKnockOuts();
    store.dispatch(new UseAbilityAction(player1.id, 'Energymite', active));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.cardList.cards).toEqual(deck.slice(0, 7));
    expect(player1.active.getPokemonCard()?.fullName).toBe(electrodeTm);
    expect(player1.active.damage).toBe(30);
    expect(prompt.validate(null)).toBe(false);
    resolve([{ index: 3, to: bench() }, { index: 5, to: active }]);
    expect(player1.bench[0].energies.cards).toEqual([deck[3]]);
    expect(player1.deck.cards).toEqual(deck.slice(7));
    expect(player1.discard.cards.slice(0, 5)).toEqual([deck[0], deck[1], deck[2], deck[4], deck[6]]);
    expect(player1.discard.cards).toContain(deck[5]);
    expect(knockOuts).toEqual([{ player: player1.id, damage: 30 }]);
    expect(player2.getPrizeLeft()).toBe(5);
    resolve([bench()]);
    expect(player1.active.energies.cards).toEqual([deck[3]]);
  });

  it('Energymite discards every viewed card if the player selects zero Energy', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: electrodeTm }],
      deck: [lightning, potion, double, potion] });
    const viewed = player1.deck.cards.slice();
    store.dispatch(new UseAbilityAction(player1.id, 'Energymite', bench()));
    resolve([]);
    expect(player1.active.energies.cards).toEqual([]);
    expect(player1.discard.cards.slice(0, 4)).toEqual(viewed);
    expect(player1.deck.cards.length).toBe(0);
    expect(player2.getPrizeLeft()).toBe(5);
  });

  it('Energymite discards all seven on a miss and does not shuffle the two remaining cards', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: electrodeTm }],
      deck: [...Array(7).fill(potion), fire, metal] });
    const original = player1.deck.cards.slice();
    store.dispatch(new UseAbilityAction(player1.id, 'Energymite', bench()));
    const prompt = pending() as ShowCardsPrompt;
    expect(prompt instanceof ShowCardsPrompt).toBe(true);
    expect(prompt.sourcePlayerId).toBe(player1.id);
    expect(prompt.cards).toEqual(original.slice(0, 7));
    resolve(true);
    expect(player1.deck.cards).toEqual(original.slice(7));
    expect(player1.discard.cards.slice(0, 7)).toEqual(original.slice(0, 7));
    expect(player2.getPrizeLeft()).toBe(5);
    expect(pending()).toBeUndefined();
  });

  for (const benchCount of [0, 1, 2, 3]) {
    it(`Gigashock deals 30 Active damage and 10 to up to two of ${benchCount} Benched Pokémon`, () => {
      const { player1, player2 } = start({ active: { card: electrodeTm, energy: [lightning, fire] } },
        { active: { card: blissey }, bench: Array.from({ length: benchCount }, () => ({ card: 'Squirtle BS' })) });
      store.dispatch(new AttackAction(player1.id, 'Gigashock'));
      finishAnimation();
      if (benchCount === 3) {
        const prompt = pending() as ChoosePokemonPrompt;
        expect(prompt instanceof ChoosePokemonPrompt).toBe(true);
        expect(player2.active.damage).toBe(30);
        expect(prompt.validate(prompt.decode([enemyBench(1)], store.state), store.state)).toBe(false);
        expect(() => resolve([enemyBench(2), enemyBench(2)])).toThrow();
        resolve([enemyBench(2), enemyBench(0)]);
      }
      finishAnimation();
      expect(player2.active.damage).toBe(30);
      expect(player2.bench.slice(0, benchCount).map(slot => slot.damage))
        .toEqual(benchCount === 3 ? [10, 0, 10] : Array(benchCount).fill(10));
    });
  }

  it('Buzzap Generator searches eligible Lightning Energy and may attach to its own source', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: electrodeViv, damage: 10 }, { card: pikachu }],
      deck: [lightning, double, lightning, metal, potion] });
    const deck = player1.deck.cards.slice();
    const knockOuts = observeKnockOuts();
    store.dispatch(new UseAbilityAction(player1.id, 'Buzzap Generator', bench()));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.options.blockedTo).toEqual([active]);
    expect(prompt.options.max).toBe(2);
    expect(prompt.isEligibleCard(deck[1], 1)).toBe(false);
    expect(prompt.isEligibleCard(deck[3], 3)).toBe(false);
    resolve([{ index: 0, to: bench() }, { index: 2, to: bench(1) }]);
    expect(player1.bench[0].energies.cards).toEqual([deck[0]]);
    expect(player2.getPrizeLeft()).toBe(6);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve([2, 0, 1]);
    expect(player1.deck.cards).toEqual([deck[4], deck[1], deck[3]]);
    expect(player1.bench[1].energies.cards).toEqual([deck[2]]);
    expect(player1.discard.cards).toContain(deck[0]);
    expect(knockOuts).toEqual([{ player: player1.id, damage: 10 }]);
    expect(player2.getPrizeLeft()).toBe(5);
  });

  it('Buzzap Generator shuffles and awards the Prize when the search returns zero', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: electrodeViv }],
      deck: [potion, metal] });
    store.dispatch(new UseAbilityAction(player1.id, 'Buzzap Generator', bench()));
    resolve([]);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve([1, 0]);
    expect(player1.deck.cards.map(card => card.fullName)).toEqual([metal, potion]);
    expect(player1.discard.cards[0].fullName).toBe(electrodeViv);
    expect(player2.getPrizeLeft()).toBe(5);
  });

  for (const condition of ['Active', 'empty deck', 'Damp']) {
    it(`Buzzap Generator cannot be used with ${condition}`, () => {
      const isActive = condition === 'Active';
      const { player1, player2 } = start({ active: { card: isActive ? electrodeViv : lugia },
        bench: isActive ? [] : [{ card: electrodeViv }], deck: condition === 'empty deck' ? [] : [lightning] },
      { active: { card: condition === 'Damp' ? 'Psyduck SVP' : blissey } });
      expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Buzzap Generator', isActive ? active : bench()))).toThrow();
      expect(player2.getPrizeLeft()).toBe(6);
      expect(pending()).toBeUndefined();
    });
  }

  it('Double KO discards both Active Pokémon and awards both players their proper Prizes', () => {
    const { player1, player2 } = start({ active: { card: forretress, energy: metalCost, damage: 10 },
      bench: [{ card: lugia }] }, { active: { card: blissey, damage: 20 }, bench: [{ card: pikachu }] });
    const knockOuts = observeKnockOuts();
    store.dispatch(new AttackAction(player1.id, 'Double KO'));
    finishAnimation();
    expect(knockOuts).toEqual([{ player: player1.id, damage: 10 }, { player: player2.id, damage: 20 }]);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(forretress);
    expect(player2.discard.cards.map(card => card.fullName)).toContain(blissey);
    expect(player1.getPrizeLeft()).toBe(4);
    expect(player2.getPrizeLeft()).toBe(5);
    expect(pending()?.playerId).toBe(player2.id);
    resolve([bench()]);
    resolve([bench()]);
    expect(player1.active.getPokemonCard()?.fullName).toBe(lugia);
    expect(player2.active.getPokemonCard()?.fullName).toBe(pikachu);
  });

  for (const protection of ['Mist Energy TEF', 'Big Parasol DAA']) {
    it(`Double KO still Knocks Out Forretress if ${protection} protects the defender`, () => {
      const { player1, player2 } = start({ active: { card: forretress, energy: metalCost }, bench: [{ card: lugia }] },
        { active: { card: blissey, damage: 20,
          ...(protection.startsWith('Mist') ? { energy: [protection] } : { tools: [protection] }) } });
      const knockOuts = observeKnockOuts();
      store.dispatch(new AttackAction(player1.id, 'Double KO'));
      finishAnimation();
      expect(knockOuts).toEqual([{ player: player1.id, damage: 0 }]);
      expect(player1.getPrizeLeft()).toBe(6);
      expect(player2.getPrizeLeft()).toBe(5);
      expect(player2.active.getPokemonCard()?.fullName).toBe(blissey);
      expect(player2.active.damage).toBe(20);
    });
  }

  it('Double KO resolves on the actual attacker when Mew ex copies it', () => {
    const { player1, player2 } = start({ active: { card: 'Mew ex MEW', energy: [metal, metal, metal] },
      bench: [{ card: lugia }] }, { active: { card: forretress }, bench: [{ card: pikachu }] });
    store.dispatch(new AttackAction(player1.id, 'Genome Hacking'));
    finishAnimation();
    expect(pending() instanceof ChooseAttackPrompt).toBe(true);
    resolve({ index: 0, attack: 'Double KO' });
    finishAnimation();
    expect(player1.discard.cards.map(card => card.fullName)).toContain('Mew ex MEW');
    expect(player2.discard.cards.map(card => card.fullName)).toContain(forretress);
    expect(player1.getPrizeLeft()).toBe(5);
    expect(player2.getPrizeLeft()).toBe(4);
  });

  it('Energy Grace attaches every available Basic Energy to one non-Pokémon-EX recipient', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [
      { card: 'Milotic FLF', damage: 10 }, { card: 'Mewtwo-EX BKT' }, { card: pikachu },
    ], discard: [fire, metal, double] });
    const knockOuts = observeKnockOuts();
    store.dispatch(new UseAbilityAction(player1.id, 'Energy Grace', bench()));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.options.blockedTo).toEqual([bench(1)]);
    expect(prompt.options.min).toBe(2);
    expect(prompt.options.max).toBe(2);
    expect(prompt.isEligibleCard(player1.discard.cards[2], 2)).toBe(false);
    const split = prompt.decode([{ index: 0, to: active }, { index: 1, to: bench(2) }], store.state);
    expect(prompt.validate(split)).toBe(false);
    resolve([{ index: 0, to: bench(2) }, { index: 1, to: bench(2) }]);
    expect(player1.bench[2].energies.cards.map(card => card.fullName)).toEqual([fire, metal]);
    expect(knockOuts).toEqual([{ player: player1.id, damage: 10 }]);
    expect(player2.getPrizeLeft()).toBe(5);
  });

  it('Energy Grace on Milotic with Life Dew does not award the opponent a Prize', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [
      { card: 'Milotic FLF', tools: ['Life Dew PLF'] },
    ], discard: [fire, metal, lightning, fighting] });
    store.dispatch(new UseAbilityAction(player1.id, 'Energy Grace', bench()));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.options.min).toBe(3);
    expect(prompt.options.max).toBe(3);
    resolve([0, 1, 2].map(index => ({ index, to: active })));
    expect(player1.active.energies.cards.length).toBe(3);
    expect(player2.getPrizeLeft()).toBe(6);
    expect(player1.discard.cards.map(card => card.fullName)).toContain('Life Dew PLF');
  });

  for (const [card, power] of [['Milotic FLF', 'Energy Grace'], ['Cofagrigus PLF', 'Six Feet Under']]) {
    it(`Damp suppresses ${power}`, () => {
      const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card }],
        discard: [fire] }, { active: { card: 'Psyduck SVP' } });
      expect(() => store.dispatch(new UseAbilityAction(player1.id, power, bench()))).toThrow();
      expect(pending()).toBeUndefined();
      expect(player2.getPrizeLeft()).toBe(6);
    });
  }

  it('Six Feet Under splits actual Ability counters and keeps its own Knock Out through Hide n Sneak', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: 'Cofagrigus PLF', damage: 10 }] },
      { active: { card: 'Poltchageist M5' }, bench: [{ card: blissey }, { card: lugia }] });
    const knockOuts = observeKnockOuts();
    store.dispatch(new UseAbilityAction(player1.id, 'Six Feet Under', bench()));
    expect(pending() instanceof PutDamagePrompt).toBe(true);
    expect(() => resolve([{ target: theirActive, damage: 15 }, { target: enemyBench(0), damage: 15 }])).toThrow();
    resolve([{ target: theirActive, damage: 20 }, { target: enemyBench(0), damage: 10 }, { target: enemyBench(1), damage: 0 }]);
    expect(player2.active.damage).toBe(0);
    expect(player2.bench[0].damage).toBe(10);
    expect(knockOuts).toEqual([{ player: player1.id, damage: 10 }]);
    expect(player2.getPrizeLeft()).toBe(5);
  });

  it('Six Feet Under awards both Prizes and promotes the opponent first after two Active Knock Outs', () => {
    const { player1, player2 } = start({ active: { card: 'Cofagrigus PLF' }, bench: [{ card: lugia }] },
      { active: { card: 'Cleffa OBF' }, bench: [{ card: blissey }] });
    store.dispatch(new UseAbilityAction(player1.id, 'Six Feet Under', active));
    resolve([{ target: theirActive, damage: 30 }]);
    expect(player1.getPrizeLeft()).toBe(5);
    expect(player2.getPrizeLeft()).toBe(5);
    expect(pending()?.playerId).toBe(player2.id);
    resolve([bench()]);
    expect(pending()?.playerId).toBe(player1.id);
    resolve([bench()]);
  });

  for (const copied of [false, true]) {
    it(`Cosmicsplosion deals 190 damage and Knocks Out its ${copied ? 'copying' : 'original'} user`, () => {
      const attacker = copied ? 'Mew ex MEW' : 'Minior GRI';
      const { player1, player2 } = start({ active: { card: attacker, energy: [fighting, fighting, fighting], damage: 20 },
        bench: [{ card: lugia }] }, { active: { card: copied ? 'Minior GRI' : 'Chien-Pao ex PAL' }, bench: [{ card: pikachu }] });
      if (copied) player2.active.damage = 10;
      const knockOuts = observeKnockOuts();
      store.dispatch(new AttackAction(player1.id, copied ? 'Genome Hacking' : 'Cosmicsplosion'));
      finishAnimation();
      if (copied) {
        resolve({ index: 0, attack: 'Cosmicsplosion' });
        finishAnimation();
        expect(player1.getPrizeLeft()).toBe(5);
        expect(player2.getPrizeLeft()).toBe(4);
        expect(knockOuts).toContain({ player: player2.id, damage: 200 });
      } else {
        expect(player2.active.damage).toBe(190);
        expect(player2.getPrizeLeft()).toBe(5);
      }
      expect(knockOuts).toContain({ player: player1.id, damage: 20 });
      expect(player1.discard.cards.map(card => card.fullName)).toContain(attacker);
    });
  }

  it('Minior Swift ignores Weakness and defender effects while respecting damage reduction on the attacker', () => {
    const { player1, player2 } = start({ active: { card: 'Minior GRI', energy: [fighting] } },
      { active: { card: pikachu } });
    player1.active.attackDamageReductionNextTurn = 10;
    player2.active.preventDamageUpToNextTurn = 100;
    store.dispatch(new AttackAction(player1.id, 'Swift'));
    finishAnimation();
    expect(player2.active.damage).toBe(10);
    expect(player1.active.getPokemonCard()?.fullName).toBe('Minior GRI');
  });

  for (const copied of [false, true]) {
    it(`Shattering Speed discards the ${copied ? 'copied' : 'original'} attacker before normal Knock Out processing`, () => {
      const attacker = copied ? 'Mew ex MEW' : 'Revavroom ex SFA';
      const { player1, player2 } = start({ active: { card: attacker, energy: [metal, metal, metal],
        tools: ['Exp. Share SVI'] }, bench: [{ card: lugia }] },
      { active: { card: copied ? 'Revavroom ex SFA' : blissey, damage: 40 }, bench: [{ card: pikachu }] });
      const [tool] = player1.active.tools;
      const attached = player1.active.energies.cards.slice();
      const knockOuts = observeKnockOuts();
      store.dispatch(new AttackAction(player1.id, copied ? 'Genome Hacking' : 'Shattering Speed'));
      finishAnimation();
      if (copied) {
        resolve({ index: 0, attack: 'Shattering Speed' });
        finishAnimation();
      }
      expect(player1.active.getPokemonCard()).toBeUndefined();
      expect(player1.discard.cards).toContain(tool);
      expect(attached.every(card => player1.discard.cards.includes(card))).toBe(true);
      expect(player1.discard.cards.map(card => card.fullName)).toContain(attacker);
      expect(player2.active.damage).toBe(290);
      expect(knockOuts).toEqual([]);
      expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
      expect(pending()?.playerId).toBe(player1.id);
      expect(player1.getPrizeLeft()).toBe(6);
      expect(player2.getPrizeLeft()).toBe(6);
      resolve([bench()]);
      finishAnimation();
      expect(player1.active.getPokemonCard()?.fullName).toBe(lugia);
      expect(knockOuts).toEqual([{ player: player2.id, damage: 290 }]);
      expect(player1.getPrizeLeft()).toBe(4);
      expect(player2.getPrizeLeft()).toBe(6);
      expect(pending()?.playerId).toBe(player2.id);
      resolve([bench()]);
    });
  }
});
