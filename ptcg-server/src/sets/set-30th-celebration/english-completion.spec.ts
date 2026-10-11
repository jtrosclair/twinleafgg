import * as fs from 'fs';
import * as path from 'path';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Mewtwo } from './mewtwo';
import { LightningEnergy } from '../set-scarlet-and-violet-energy/lightning-energy';
import { DoubleColorlessEnergy } from '../set-base-set/double-colorless-energy';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';

function leaf(file: string, constructor: string): PokemonCard | undefined {
  const source = path.join(__dirname, file + '.ts');
  return fs.existsSync(source) ? new (require('./' + file)[constructor])() : undefined;
}

function battle(card: PokemonCard) {
  const state = new State();
  const player = new Player();
  const opponent = new Player();
  player.id = 1;
  opponent.id = 2;
  state.players = [player, opponent];
  state.phase = GamePhase.PLAYER_TURN;
  state.turn = 2;
  for (const p of state.players) {
    p.prizes = Array.from({ length: 6 }, () => { const prize = new PokemonCardList(); prize.cards = [new LightningEnergy()]; return prize; });
    p.bench = Array.from({ length: 5 }, () => new PokemonCardList());
    p.deck.cards = [new LightningEnergy(), new LightningEnergy()];
  }
  player.active.cards = [card];
  opponent.active.cards = [new Mewtwo()];
  const store = new Store({ onStateChange: () => undefined });
  store.state = state;
  return { state, player, opponent, card, store };
}

describe('30C additive English completion', () => {
  it('Palkia LV.X Restructure assigns each switch to the printed choosing player and inherits its previous attacks', () => {
    const card = leaf('english-palkia-lv-x', 'EnglishPalkiaLvXCC12');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    const base = new (require('./english-palkia').EnglishPalkia20)();
    b.player.active.cards = [base, card];
    b.player.bench[0].cards = [new Mewtwo()];
    b.opponent.bench[0].cards = [new Mewtwo()];
    const attacks = new (require('../../game/store/effects/check-effects').CheckPokemonAttacksEffect)(b.player);
    card.reduceEffect(b.store, b.state, attacks);
    expect(attacks.attacks).toContain(base.attacks[0]);
    const PowerEffect = require('../../game/store/effects/game-effects').PowerEffect;
    card.reduceEffect(b.store, b.state, new PowerEffect(b.player, card.powers[1], card));
    const first = b.state.prompts[0];
    expect(first.playerId).toBe(b.opponent.id);
    b.store.dispatch(new ResolvePromptAction(first.id, [b.player.bench[0]]));
    const second = b.state.prompts.find(p => p.result === undefined)!;
    expect(second.playerId).toBe(b.player.id);
    b.store.dispatch(new ResolvePromptAction(second.id, [b.opponent.bench[0]]));
    expect(() => card.reduceEffect(b.store, b.state, new PowerEffect(b.player, card.powers[1], card))).toThrow();
  });

  it('Palkia LV.X Hydro Reflect moves all attached Energy to its Bench, not a subset', () => {
    const card = leaf('english-palkia-lv-x', 'EnglishPalkiaLvXCC12');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    const one = new LightningEnergy();
    const two = new LightningEnergy();
    b.player.active.cards.push(one, two);
    b.player.bench[0].cards = [new Mewtwo()];
    card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, card.attacks[0]));
    const prompt = b.state.prompts[0];
    const from = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const to = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
    b.store.dispatch(new ResolvePromptAction(prompt.id, [{ card: one, from, to }, { card: two, from, to }]));
    expect(b.player.bench[0].cards).toContain(one);
    expect(b.player.bench[0].cards).toContain(two);
    expect(b.player.active.cards).not.toContain(one);
  });
  it('Shining Celebi heals its chosen Bench by the number of Water Energy cards', () => {
    const card = leaf('english-shining-celebi', 'EnglishShiningCelebiCC6');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    const WaterEnergy = require('../set-scarlet-and-violet-energy/water-energy').WaterEnergy;
    b.player.active.cards.push(new WaterEnergy(), new WaterEnergy());
    b.player.bench[0].cards = [new Mewtwo()];
    b.player.bench[0].damage = 30;
    card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, card.attacks[0]));
    b.store.dispatch(new ResolvePromptAction(b.state.prompts[0].id, [b.player.bench[0]]));
    expect(b.player.bench[0].damage).toBe(10);
  });

  it('Shining Celebi flips once per opposing Energy and applies the chosen condition after any heads', () => {
    const card = leaf('english-shining-celebi', 'EnglishShiningCelebiCC6');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    b.opponent.active.cards.push(new LightningEnergy(), new LightningEnergy());
    spyOn(Math, 'random').and.returnValues(0.9, 0.1);
    const effect = new AttackEffect(b.player, b.opponent, card.attacks[1]);
    card.reduceEffect(b.store, b.state, effect);
    for (let i = 0; i < 2; i++) {
      b.store.dispatch(new ResolvePromptAction(b.state.prompts.find(p => p.result === undefined)!.id, true));
    }
    const choice = b.state.prompts.find(p => p.result === undefined)!;
    expect(choice.type).toBe('Select');
    b.store.dispatch(new ResolvePromptAction(choice.id, 2));
    const SpecialCondition = require('../../game/store/card/card-types').SpecialCondition;
    expect(b.opponent.active.specialConditions).toContain(SpecialCondition.POISONED);
    expect(effect.damage).toBe(10);
  });
  it('Classic Misty pays two discards and boosts only positive Active damage by a Misty attacker until end of turn', () => {
    const exists = fs.existsSync(path.join(__dirname, 'english-misty.ts'));
    expect(exists).toBe(true);
    if (!exists) { return; }
    const card = new (require('./english-misty').EnglishMistyCC3)();
    const b = battle(new Mewtwo());
    b.card.name = "Misty's Mewtwo";
    const first = new LightningEnergy();
    const second = new LightningEnergy();
    b.player.hand.cards = [card, first, second];
    const TrainerEffect = require('../../game/store/effects/play-card-effects').TrainerEffect;
    card.reduceEffect(b.store, b.state, new TrainerEffect(b.player, card));
    const prompt = b.state.prompts[0];
    b.store.dispatch(new ResolvePromptAction(prompt.id, [first, second]));
    expect(b.player.discard.cards).toEqual([first, second]);
    b.player.hand.moveCardTo(card, b.player.discard);
    const PutDamageEffect = require('../../game/store/effects/attack-effects').PutDamageEffect;
    const attack = new AttackEffect(b.player, b.opponent, b.card.attacks[1]);
    const boost = (damage: number) => {
      const effect = new PutDamageEffect(attack, damage);
      card.reduceEffect(b.store, b.state, effect);
      return effect.damage;
    };
    expect(boost(10)).toBe(30);
    expect(boost(0)).toBe(0);
    b.card.name = 'Mewtwo';
    expect(boost(10)).toBe(10);
    b.card.name = "Misty's Mewtwo";
    const EndTurnEffect = require('../../game/store/effects/game-phase-effects').EndTurnEffect;
    card.reduceEffect(b.store, b.state, new EndTurnEffect(b.player));
    expect(boost(10)).toBe(10);
  });
  it('Classic Magikarp adds 20 damage only when both coins are heads', () => {
    const card = leaf('english-magikarp', 'EnglishMagikarpCC30');
    expect(card).toBeDefined();
    if (!card) { return; }
    const random = spyOn(Math, 'random');
    for (const coins of [[true, true], [true, false], [false, true], [false, false]]) {
      let flip = 0;
      random.and.callFake(() => coins[flip++] ? 0 : 1);
      const b = battle(card);
      const attack = new AttackEffect(b.player, b.opponent, card.attacks[0]);
      card.reduceEffect(b.store, b.state, attack);
      for (const result of coins) {
        const prompt = b.state.prompts.find(p => p.result === undefined)!;
        b.store.dispatch(new ResolvePromptAction(prompt.id, result));
      }
      expect(attack.damage).toBe(coins.every(Boolean) ? 30 : 10);
    }
  });
  it("Erika's Jigglypuff heals each damaged Pokémon on both sides and Pulled Punch checks existing damage", () => {
    const card = leaf('english-erikas-jigglypuff', 'EnglishErikasJigglypuffCC4');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    b.player.active.damage = 20;
    b.player.bench[0].cards = [new Mewtwo()];
    b.player.bench[0].damage = 10;
    b.opponent.active.damage = 30;
    card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, card.attacks[0]));
    expect([b.player.active.damage, b.player.bench[0].damage, b.opponent.active.damage]).toEqual([10, 0, 20]);
    const damaged = new AttackEffect(b.player, b.opponent, card.attacks[1]);
    card.reduceEffect(b.store, b.state, damaged);
    expect(damaged.damage).toBe(10);
    b.opponent.active.damage = 0;
    const untouched = new AttackEffect(b.player, b.opponent, card.attacks[1]);
    card.reduceEffect(b.store, b.state, untouched);
    expect(untouched.damage).toBe(40);
  });
  it('Palkia Wormhole switches after damage and lets the opponent choose their replacement', () => {
    const card = leaf('english-palkia', 'EnglishPalkia20');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    b.player.bench[0].cards = [new Mewtwo()];
    b.opponent.bench[0].cards = [new Mewtwo()];
    const ours = b.player.bench[0];
    const theirs = b.opponent.bench[0];
    card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, card.attacks[0]));
    expect(b.state.prompts.length).toBe(0);
    const AfterAttackEffect = require('../../game/store/effects/game-phase-effects').AfterAttackEffect;
    card.reduceEffect(b.store, b.state, new AfterAttackEffect(b.player, b.opponent, card.attacks[0]));
    expect(b.state.prompts[0].playerId).toBe(b.player.id);
    b.store.dispatch(new ResolvePromptAction(b.state.prompts[0].id, [ours]));
    const second = b.state.prompts.find(p => p.result === undefined)!;
    expect(second.playerId).toBe(b.opponent.id);
    b.store.dispatch(new ResolvePromptAction(second.id, [theirs]));
    expect(b.player.active).toBe(ours);
    expect(b.opponent.active).toBe(theirs);
  });

  it('Palkia cannot force an opponent switch when it has no Benched replacement', () => {
    const card = leaf('english-palkia', 'EnglishPalkia20');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    b.opponent.bench[0].cards = [new Mewtwo()];
    const AfterAttackEffect = require('../../game/store/effects/game-phase-effects').AfterAttackEffect;
    card.reduceEffect(b.store, b.state, new AfterAttackEffect(b.player, b.opponent, card.attacks[0]));
    expect(b.state.prompts.length).toBe(0);
  });
  it('Pikachu #53 benches only Basics within free slots and Thunderbolt discards all its Energy', () => {
    const card = leaf('english-pikachu-ex-53', 'EnglishPikachuEx53');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    const basic = new Mewtwo();
    const evolved = new Mewtwo();
    evolved.stage = 1;
    b.player.deck.cards = [basic, evolved];
    card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, card.attacks[0]));
    const prompt = b.state.prompts[0] as import('../../game/store/prompts/choose-cards-prompt').ChooseCardsPrompt;
    expect(prompt.validate([evolved])).toBe(false);
    expect(prompt.options.max).toBe(5);
    b.store.dispatch(new ResolvePromptAction(prompt.id, [basic]));
    expect(b.player.bench[0].cards).toContain(basic);
    const energy = new LightningEnergy();
    b.player.active.cards.push(energy);
    b.player.active.energies.cards.push(energy);
    card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, card.attacks[1]));
    expect(b.player.discard.cards).toContain(energy);
    expect(b.player.active.cards).not.toContain(energy);
  });
  it('Pikachu #54 attaches multiple Basic Energy from hand and rejects Special Energy', () => {
    const card = leaf('english-pikachu-ex-54', 'EnglishPikachuEx54');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    const first = new LightningEnergy();
    const second = new LightningEnergy();
    const special = new DoubleColorlessEnergy();
    b.player.hand.cards = [first, second, special];
    const bench = new PokemonCardList();
    bench.cards = [new Mewtwo()];
    b.player.bench[0] = bench;
    card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, card.attacks[0]));
    const prompt = b.state.prompts[0] as AttachEnergyPrompt;
    expect(prompt.validate([{ card: special, to: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 } }])).toBe(false);
    b.store.dispatch(new ResolvePromptAction(prompt.id, prompt.decode([
      { index: 0, to: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 } },
      { index: 1, to: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 } }
    ], b.state)));
    expect(b.player.active.cards).toContain(first);
    expect(bench.cards).toContain(second);
    expect(b.player.hand.cards).toEqual([special]);
  });

  it('Pikachu #54 Thunder does 30 self-damage without changing its 200 damage', () => {
    const card = leaf('english-pikachu-ex-54', 'EnglishPikachuEx54');
    expect(card).toBeDefined();
    if (!card) { return; }
    const b = battle(card);
    const effect = new AttackEffect(b.player, b.opponent, card.attacks[1]);
    card.reduceEffect(b.store, b.state, effect);
    expect(effect.damage).toBe(200);
    expect(b.player.active.damage).toBe(30);
  });
  it('adds printed Mewtwo #63 without rewriting the legacy puzzle identity', () => {
    const card = leaf('english-mewtwo', 'EnglishMewtwo63');
    expect(card).toBeDefined();
    if (!card) { return; }
    expect([card.set, card.setNumber, card.usSetNumber, card.name]).toEqual(['30C', '63', '30C 63', 'Mewtwo']);
    expect(card.fullName).not.toBe(new Mewtwo().fullName);
    expect(new Mewtwo().setNumber).toBe('64');
    expect(new Mewtwo().fullName).toBe('Mewtwo 30C');
    expect(card.attacks).toEqual(new Mewtwo().attacks);
    expect(card.reduceEffect).toBe(Mewtwo.prototype.reduceEffect);
  });
});
