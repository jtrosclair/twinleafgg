import { ClientSimulator } from '../../client/simulator';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { AttackAction } from '../../game/store/actions/game-actions';
import { CardTag } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { useAttack, useAbility } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const rapid = 'Rapid Strike Urshifu FLO';
const single = 'Single Strike Urshifu FLO';
const luminous = 'Luminous Energy PAL';
const fighting = 'Fighting Energy SVE';
const fire = 'Fire Energy SVE';
const mew = 'Mew ex MEW';
const dragapult = 'Dragapult ex TWM';
const meowth = 'Meowth FLO';
const persian = 'Persian FLO';
const attackCases = [
  { card: rapid, name: 'Torrential Strike', energy: 'Water Energy SVE', blend: 'Blend Energy WLFM DRX', damage: 120, spread: 40 },
  { card: single, name: 'Wicked Blow', energy: 'Darkness Energy SVE', blend: 'Unit Energy FDY FLI', damage: 260, spread: 0 },
];

function startAttack(card: string, energy: string[], options: { stadium?: string, bench?: string[], copy?: boolean, damage?: number[] } = {}) {
  const { state } = setupGame({ turn: 5,
    player1: { active: { card: options.copy ? mew : card, energy: [fighting, fighting, ...energy] }, deck: padDeck(10) },
    player2: { active: { card: options.copy ? card : dragapult },
      bench: (options.bench ?? [mew, mew]).map(name => ({ card: name })), deck: padDeck(10) }
  });
  const opponent = state.players[1];
  options.damage?.forEach((damage, index) => {
    const slot = index === 0 ? opponent.active : opponent.bench[index - 1];
    slot.damage = damage;
  });
  if (options.stadium) {
    state.players[1].stadium.cards.push(getCardByName(options.stadium));
  }
  state.cardNames = [];
  for (const player of state.players) {
    const zones = [player.active, ...player.bench, ...player.prizes, player.hand, player.deck,
      player.discard, player.lostzone, player.stadium, player.supporter];
    for (const zone of zones) {
      for (const card of zone.cards) card.id = state.cardNames.push(card.fullName) - 1;
    }
  }
  const sim = new ClientSimulator();
  sim.loadSnapshot({ stateData: Buffer.from(new StateSerializer().serialize(state)).toString('base64') });
  return sim;
}

function pendingEnergy(sim: ClientSimulator): ChooseEnergyPrompt | undefined {
  return sim.state.prompts.find((prompt): prompt is ChooseEnergyPrompt =>
    prompt instanceof ChooseEnergyPrompt && prompt.result === undefined);
}

function visibleDamage(sim: ClientSimulator): number[] {
  const opponent = sim.state.players[1];
  return [opponent.active.damage, ...opponent.bench.filter(slot => slot.getPokemonCard()).map(slot => slot.damage)];
}

describe('Aura Seeker Urshifu', () => {
  let sim: ClientSimulator | undefined;
  afterEach(() => sim?.cleanup());

  for (const { card, name, energy, blend, damage, spread } of attackCases) {
    for (const paidEnergy of [energy, luminous, blend]) {
      it(`${name} pays with ${paidEnergy} and only then applies the printed bonus`, () => {
        sim = startAttack(card, [paidEnergy, fire]);
        const player = sim.state.players[0];
        sim.dispatch(new AttackAction(sim.humanPlayerId, name));
        const prompt = pendingEnergy(sim);
        expect(prompt?.energy.map(entry => entry.card.fullName)).toEqual([paidEnergy]);
        expect(visibleDamage(sim)).toEqual([0, 0, 0]);
        expect(player.discard.cards.some(card => card.fullName === paidEnergy)).toBe(false);
        expect(prompt).toBeDefined();
        if (!prompt) return;
        sim.resolvePrompt(prompt.id, [0]);
        expect(player.discard.cards.map(card => card.fullName)).toContain(paidEnergy);
        expect(player.active.energies.cards.some(card => card.fullName === paidEnergy)).toBe(false);
        expect(visibleDamage(sim)).toEqual([damage, spread, spread]);
      });
    }

    it(`${name} keeps the Energy and deals only 120 when declined`, () => {
      sim = startAttack(card, [energy]);
      sim.dispatch(new AttackAction(sim.humanPlayerId, name));
      const prompt = pendingEnergy(sim);
      expect(prompt?.options.allowCancel).toBe(true);
      if (!prompt) return;
      sim.resolvePrompt(prompt.id, null);
      expect(sim.state.players[0].active.energies.cards.map(card => card.fullName)).toContain(energy);
      expect(visibleDamage(sim)).toEqual([120, 0, 0]);
    });

    it(`${name} gets no bonus if the selected Energy is prevented from being discarded`, () => {
      sim = startAttack(card, [energy]);
      const store = sim['store'];
      const reduce = store.reduceEffect.bind(store);
      spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof DiscardCardsEffect) {
          effect.preventDefault = true;
          return state;
        }
        return reduce(state, effect);
      });
      sim.dispatch(new AttackAction(sim.humanPlayerId, name));
      const prompt = pendingEnergy(sim);
      expect(prompt).toBeDefined();
      if (!prompt) return;
      sim.resolvePrompt(prompt.id, [0]);
      expect(sim.state.players[0].active.energies.cards.map(card => card.fullName)).toContain(energy);
      expect(visibleDamage(sim)).toEqual([120, 0, 0]);
    });

    for (const suppressWith of ['Gift Energy LOR', 'Temple of Sinnoh ASR']) {
      it(`${name} cannot treat Luminous Energy as typed under ${suppressWith}`, () => {
        const temple = suppressWith === 'Temple of Sinnoh ASR';
        sim = startAttack(card, temple ? [luminous] : [luminous, suppressWith], { stadium: temple ? suppressWith : undefined });
        sim.dispatch(new AttackAction(sim.humanPlayerId, name));
        expect(pendingEnergy(sim)).toBeUndefined();
        expect(sim.state.players[0].active.energies.cards.map(card => card.fullName)).toContain(luminous);
        expect(visibleDamage(sim)).toEqual([120, 0, 0]);
      });
    }
  }

  it('applies all damage before checking Active and Bench Knock Outs', () => {
    sim = startAttack(rapid, ['Water Energy SVE'], { damage: [200, 140] });
    const store = sim['store'];
    const reduce = store.reduceEffect.bind(store);
    const opponent = store.state.players[1];
    let damageAtFirstKnockOut: number[] | undefined;
    spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof KnockOutEffect && effect.player === opponent && !damageAtFirstKnockOut) {
        damageAtFirstKnockOut = [opponent.active.damage, opponent.bench[0].damage, opponent.bench[1].damage];
      }
      return reduce(state, effect);
    });
    const prizesBefore = store.state.players[0].getPrizeLeft();
    sim.dispatch(new AttackAction(sim.humanPlayerId, 'Torrential Strike'));
    const prompt = pendingEnergy(sim);
    expect(prompt).toBeDefined();
    if (!prompt) return;
    sim.resolvePrompt(prompt.id, [0]);
    expect(damageAtFirstKnockOut).toEqual([320, 180, 40]);
    expect(opponent.discard.cards.map(card => card.fullName).sort()).toEqual([dragapult, mew].sort());
    expect(store.state.players[0].getPrizeLeft()).toBe(prizesBefore - 4);
  });

  it('keeps Bench protection intact after Torrential Strike pays the discard', () => {
    sim = startAttack(rapid, ['Water Energy SVE'], { bench: [mew, 'Manaphy BRS'] });
    sim.dispatch(new AttackAction(sim.humanPlayerId, 'Torrential Strike'));
    const prompt = pendingEnergy(sim);
    expect(prompt).toBeDefined();
    if (!prompt) return;
    sim.resolvePrompt(prompt.id, [0]);
    expect(sim.state.players[0].discard.cards.map(card => card.fullName)).toContain('Water Energy SVE');
    expect(visibleDamage(sim)).toEqual([120, 0, 0]);
  });

  it('uses the copying Pokémon’s Energy and preserves copied Bench damage', () => {
    sim = startAttack(rapid, [luminous], { copy: true });
    sim.dispatch(new AttackAction(sim.humanPlayerId, 'Genome Hacking'));
    const selectAttack = sim.state.prompts.find(prompt => prompt.type === 'Choose attack' && prompt.result === undefined);
    expect(selectAttack).toBeDefined();
    if (!selectAttack) return;
    sim.resolvePrompt(selectAttack.id, { index: 0, attack: 'Torrential Strike' });
    const prompt = pendingEnergy(sim);
    expect(prompt?.energy.map(entry => entry.card.fullName)).toEqual([luminous]);
    if (!prompt) return;
    sim.resolvePrompt(prompt.id, [0]);
    expect(sim.state.players[0].discard.cards.map(card => card.fullName)).toContain(luminous);
    const opponent = sim.state.players[1];
    expect(opponent.discard.cards.map(card => card.fullName)).toContain(rapid);
    expect(visibleDamage(sim)).toEqual([40, 40]);
  });

  it('keeps the printed M7 identity and avoids granting the old Strike designations', () => {
    sim = startAttack(rapid, [fire]);
    const rapidCard = sim.state.players[0].active.getPokemonCard()!;
    const singleCard = getCardByName(single) as PokemonCard;
    expect([rapidCard.set, rapidCard.setNumber, rapidCard.fullName]).toEqual(['M7', '50', rapid]);
    expect([singleCard.set, singleCard.setNumber, singleCard.fullName]).toEqual(['M7', '49', single]);
    for (const card of [rapidCard, singleCard]) {
      expect(card.tags).not.toContain(CardTag.RAPID_STRIKE);
      expect(card.tags).not.toContain(CardTag.SINGLE_STRIKE);
      expect(card.cardTag).not.toContain(CardTag.RAPID_STRIKE);
      expect(card.cardTag).not.toContain(CardTag.SINGLE_STRIKE);
    }
  });
});

describe('Aura Seeker Pay Day and Large Coin', () => {
  it('deals Pay Day damage before drawing', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: meowth, energy: [fire] }, deck: padDeck(10) },
      player2: { active: { card: dragapult }, deck: padDeck(10) }
    });
    const reduce = game.store.reduceEffect.bind(game.store);
    const handCounts: number[] = [];
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof DealDamageEffect) handCounts.push(effect.player.hand.cards.length);
      return reduce(state, effect);
    });
    useAttack(game.store, game.state, 0, 'Pay Day');
    expect(handCounts).toEqual([0]);
    expect(game.player1.hand.cards.length).toBe(1);
    expect(game.player2.active.damage).toBe(10);
  });

  it('retains a prior attack modifier when calculating Greedy Slash', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: persian }, hand: [fire, fighting], deck: padDeck(10) },
      player2: { active: { card: dragapult }, deck: padDeck(10) }
    });
    const attack = new AttackEffect(game.player1, game.player2, game.player1.active.getPokemonCard()!.attacks[0]);
    attack.damage += 30;
    game.store.reduceEffect(game.state, attack);
    expect(attack.damage).toBe(70);
  });

  it('Large Coin needs two Pokémon with Pay Day in play and spends the turn’s use', () => {
    const onlyOne = setupGame({ turn: 5,
      player1: { active: { card: persian }, bench: [{ card: meowth }], hand: [meowth], deck: padDeck(10) },
      player2: { active: { card: dragapult }, bench: [{ card: meowth }], deck: padDeck(10) }
    });
    expect(() => useAbility(onlyOne.store, onlyOne.state, 0, 'Large Coin')).toThrow();
    expect(onlyOne.store.state.players[0].hand.cards.length).toBe(1);

    const game = setupGame({ turn: 5,
      player1: { active: { card: persian }, bench: [{ card: meowth }, { card: meowth }], deck: padDeck(10) },
      player2: { active: { card: dragapult }, deck: padDeck(10) }
    });
    useAbility(game.store, game.state, 0, 'Large Coin');
    expect(game.player1.hand.cards.length).toBe(2);
    expect(() => useAbility(game.store, game.state, 0, 'Large Coin')).toThrow();
  });
});
