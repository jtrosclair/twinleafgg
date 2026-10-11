import { CardList, Player, PokemonCard, State } from '../../game';
import { GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { BoardEffect } from '../../game/store/card/card-types';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { MegaGreninjaex } from './mega-greninja-ex';
import { DoubleColorlessEnergy } from '../set-base-set/double-colorless-energy';
import { Cinccinoex } from './cinccino-ex';
import { CinccinoexFA, CinccinoexSIR, MegaGreninjaexFA, MegaGreninjaexSIR, MegaGreninjaexHR } from './other-prints';

function battle(card: PokemonCard) {
  const state = new State();
  const player = new Player();
  const opponent = new Player();
  player.id = 1; opponent.id = 2;
  state.players = [player, opponent];
  state.phase = GamePhase.PLAYER_TURN;
  player.active.cards = [card];
  const target = new Cinccinoex();
  target.hp = 350;
  opponent.active.cards = [target];
  state.players.forEach(p => {
    p.deck.cards = [new WaterEnergy(), new WaterEnergy()];
    p.prizes = [new CardList()];
    p.prizes[0].cards = [new WaterEnergy()];
  });
  const store = new Store({ onStateChange: () => {} });
  store.state = state;
  return { state, player, opponent, store };
}

describe('Chaos Rising Cinccino and Mega Greninja mechanics', () => {
  [Cinccinoex, CinccinoexFA, CinccinoexSIR].forEach(Print => {
    it('counts both Energy provided by Double Colorless for ' + Print.name, () => {
      const card = new Print();
      const b = battle(card);
      b.player.hand.cards = [new DoubleColorlessEnergy()];
      b.player.hand.moveCardsTo(b.player.hand.cards.slice(), b.player.active);
      const effect = new AttackEffect(b.player, b.opponent, card.attacks[0]);
      card.reduceEffect(b.store, b.state, effect);
      expect(effect.damage).toBe(80);
    });
  });

  [MegaGreninjaex, MegaGreninjaexFA, MegaGreninjaexSIR, MegaGreninjaexHR].forEach(Print => {
    it('cancels Mortal Shuriken without damage or consuming the ability for ' + Print.name, () => {
      const card = new Print();
      const b = battle(card);
      const energy = new WaterEnergy();
      b.player.hand.cards = [energy];
      card.reduceEffect(b.store, b.state, new PowerEffect(b.player, card.powers[0], card));
      const payment = b.state.prompts.find(p => p instanceof ChooseCardsPrompt)!;
      expect(payment.validate(null, b.state)).toBe(true);
      b.store.dispatch(new ResolvePromptAction(payment.id, null));
      expect(b.opponent.active.damage).toBe(0);
      expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt)).toBe(false);
      expect(b.player.marker.hasMarker(card.MORTAL_SHURIKEN_MARKER, card)).toBe(false);
      expect(b.player.hand.cards).toEqual([energy]);
      expect(b.player.discard.cards.length).toBe(0);
      expect(b.player.active.boardEffect.includes(BoardEffect.ABILITY_USED)).toBe(false);
      expect(() => card.reduceEffect(b.store, b.state, new PowerEffect(b.player, card.powers[0], card))).not.toThrow();
    });

    it('requires payment before targeting and places six counters after valid discard for ' + Print.name, () => {
      const card = new Print();
      const b = battle(card);
      const energy = new WaterEnergy();
      b.player.hand.cards = [energy];
      card.reduceEffect(b.store, b.state, new PowerEffect(b.player, card.powers[0], card));
      expect(b.state.prompts.length).toBe(1);
      expect(b.opponent.active.damage).toBe(0);
      const payment = b.state.prompts[0] as ChooseCardsPrompt;
      expect(payment.validate([new DoubleColorlessEnergy()])).toBe(false);
      expect(payment.validate([energy])).toBe(true);
      b.store.dispatch(new ResolvePromptAction(payment.id, [energy]));
      expect(b.player.discard.cards).toEqual([energy]);
      expect(b.player.hand.cards.length).toBe(0);
      expect(b.opponent.active.damage).toBe(0);
      const target = b.state.prompts.find(p => p instanceof ChoosePokemonPrompt)!;
      expect(target.validate([b.opponent.active], b.state)).toBe(true);
      b.store.dispatch(new ResolvePromptAction(target.id, [b.opponent.active]));
      expect(b.opponent.active.damage).toBe(60);
      expect(b.player.marker.hasMarker(card.MORTAL_SHURIKEN_MARKER, card)).toBe(true);
      expect(b.player.active.boardEffect.includes(BoardEffect.ABILITY_USED)).toBe(true);
      b.player.hand.cards = [new WaterEnergy()];
      expect(() => card.reduceEffect(b.store, b.state, new PowerEffect(b.player, card.powers[0], card))).toThrow();
    });

    it('does not grant Ninja Spinner bonus before the Energy actually returns for ' + Print.name, () => {
      const card = new Print();
      const b = battle(card);
      const energy = new WaterEnergy();
      b.player.hand.cards = [energy, new WaterEnergy()];
      b.player.hand.moveCardsTo(b.player.hand.cards.slice(), b.player.active);
      const effect = new AttackEffect(b.player, b.opponent, card.attacks[0]);
      card.reduceEffect(b.store, b.state, effect);
      expect(effect.damage).toBe(120);
      const confirm = b.state.prompts[0] as ConfirmPrompt;
      b.store.dispatch(new ResolvePromptAction(confirm.id, true));
      expect(effect.damage).toBe(120);
      expect(b.player.hand.cards.length).toBe(0);
      const payment = b.state.prompts.find(p => p instanceof ChooseEnergyPrompt) as ChooseEnergyPrompt;
      const selected = [payment.energy.find(e => e.card === energy)!];
      expect(payment.validate(selected)).toBe(true);
      b.store.dispatch(new ResolvePromptAction(payment.id, selected));
      // Both upstream branches and the printed English card specify +80, not +160.
      expect(effect.damage).toBe(200);
      expect(b.player.hand.cards).toEqual([energy]);
      expect(b.player.active.cards.includes(energy)).toBe(false);
      expect(b.player.active.energies.cards.includes(energy)).toBe(false);
    });

    it('keeps base Ninja Spinner damage when the bonus is declined for ' + Print.name, () => {
      const card = new Print();
      const b = battle(card);
      const effect = new AttackEffect(b.player, b.opponent, card.attacks[0]);
      card.reduceEffect(b.store, b.state, effect);
      b.store.dispatch(new ResolvePromptAction(b.state.prompts[0].id, false));
      expect(effect.damage).toBe(120);
      expect(b.state.prompts.some(p => p instanceof ChooseEnergyPrompt)).toBe(false);
    });

    it('does not grant Ninja Spinner bonus when no Water Energy can be returned for ' + Print.name, () => {
      const card = new Print();
      const b = battle(card);
      b.player.hand.cards = [new DoubleColorlessEnergy()];
      b.player.hand.moveCardsTo(b.player.hand.cards.slice(), b.player.active);
      const effect = new AttackEffect(b.player, b.opponent, card.attacks[0]);
      card.reduceEffect(b.store, b.state, effect);
      b.store.dispatch(new ResolvePromptAction(b.state.prompts[0].id, true));
      const payment = b.state.prompts.find(p => p instanceof ChooseEnergyPrompt) as ChooseEnergyPrompt;
      expect(payment.validate([])).toBe(true);
      b.store.dispatch(new ResolvePromptAction(payment.id, []));
      expect(effect.damage).toBe(120);
      expect(b.player.hand.cards.length).toBe(0);
    });
  });
});
