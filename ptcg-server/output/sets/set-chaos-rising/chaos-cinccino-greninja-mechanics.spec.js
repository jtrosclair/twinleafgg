"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../game");
const state_1 = require("../../game/store/state/state");
const store_1 = require("../../game/store/store");
const game_effects_1 = require("../../game/store/effects/game-effects");
const resolve_prompt_action_1 = require("../../game/store/actions/resolve-prompt-action");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const choose_energy_prompt_1 = require("../../game/store/prompts/choose-energy-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const water_energy_1 = require("../set-scarlet-and-violet-energy/water-energy");
const mega_greninja_ex_1 = require("./mega-greninja-ex");
const double_colorless_energy_1 = require("../set-base-set/double-colorless-energy");
const cinccino_ex_1 = require("./cinccino-ex");
const other_prints_1 = require("./other-prints");
function battle(card) {
    const state = new game_1.State();
    const player = new game_1.Player();
    const opponent = new game_1.Player();
    player.id = 1;
    opponent.id = 2;
    state.players = [player, opponent];
    state.phase = state_1.GamePhase.PLAYER_TURN;
    player.active.cards = [card];
    const target = new cinccino_ex_1.Cinccinoex();
    target.hp = 350;
    opponent.active.cards = [target];
    state.players.forEach(p => {
        p.deck.cards = [new water_energy_1.WaterEnergy(), new water_energy_1.WaterEnergy()];
        p.prizes = [new game_1.CardList()];
        p.prizes[0].cards = [new water_energy_1.WaterEnergy()];
    });
    const store = new store_1.Store({ onStateChange: () => { } });
    store.state = state;
    return { state, player, opponent, store };
}
describe('Chaos Rising Cinccino and Mega Greninja mechanics', () => {
    [cinccino_ex_1.Cinccinoex, other_prints_1.CinccinoexFA, other_prints_1.CinccinoexSIR].forEach(Print => {
        it('counts both Energy provided by Double Colorless for ' + Print.name, () => {
            const card = new Print();
            const b = battle(card);
            b.player.hand.cards = [new double_colorless_energy_1.DoubleColorlessEnergy()];
            b.player.hand.moveCardsTo(b.player.hand.cards.slice(), b.player.active);
            const effect = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
            card.reduceEffect(b.store, b.state, effect);
            expect(effect.damage).toBe(80);
        });
    });
    [mega_greninja_ex_1.MegaGreninjaex, other_prints_1.MegaGreninjaexFA, other_prints_1.MegaGreninjaexSIR, other_prints_1.MegaGreninjaexHR].forEach(Print => {
        it('cancels Mortal Shuriken without damage or consuming the ability for ' + Print.name, () => {
            const card = new Print();
            const b = battle(card);
            const energy = new water_energy_1.WaterEnergy();
            b.player.hand.cards = [energy];
            card.reduceEffect(b.store, b.state, new game_effects_1.PowerEffect(b.player, card.powers[0], card));
            const payment = b.state.prompts.find(p => p instanceof choose_cards_prompt_1.ChooseCardsPrompt);
            expect(payment.validate(null, b.state)).toBe(true);
            b.store.dispatch(new resolve_prompt_action_1.ResolvePromptAction(payment.id, null));
            expect(b.opponent.active.damage).toBe(0);
            expect(b.state.prompts.some(p => p instanceof choose_pokemon_prompt_1.ChoosePokemonPrompt)).toBe(false);
            expect(b.player.marker.hasMarker(card.MORTAL_SHURIKEN_MARKER, card)).toBe(false);
            expect(b.player.hand.cards).toEqual([energy]);
            expect(b.player.discard.cards.length).toBe(0);
            expect(b.player.active.boardEffect.includes(card_types_1.BoardEffect.ABILITY_USED)).toBe(false);
            expect(() => card.reduceEffect(b.store, b.state, new game_effects_1.PowerEffect(b.player, card.powers[0], card))).not.toThrow();
        });
        it('requires payment before targeting and places six counters after valid discard for ' + Print.name, () => {
            const card = new Print();
            const b = battle(card);
            const energy = new water_energy_1.WaterEnergy();
            b.player.hand.cards = [energy];
            card.reduceEffect(b.store, b.state, new game_effects_1.PowerEffect(b.player, card.powers[0], card));
            expect(b.state.prompts.length).toBe(1);
            expect(b.opponent.active.damage).toBe(0);
            const payment = b.state.prompts[0];
            expect(payment.validate([new double_colorless_energy_1.DoubleColorlessEnergy()])).toBe(false);
            expect(payment.validate([energy])).toBe(true);
            b.store.dispatch(new resolve_prompt_action_1.ResolvePromptAction(payment.id, [energy]));
            expect(b.player.discard.cards).toEqual([energy]);
            expect(b.player.hand.cards.length).toBe(0);
            expect(b.opponent.active.damage).toBe(0);
            const target = b.state.prompts.find(p => p instanceof choose_pokemon_prompt_1.ChoosePokemonPrompt);
            expect(target.validate([b.opponent.active], b.state)).toBe(true);
            b.store.dispatch(new resolve_prompt_action_1.ResolvePromptAction(target.id, [b.opponent.active]));
            expect(b.opponent.active.damage).toBe(60);
            expect(b.player.marker.hasMarker(card.MORTAL_SHURIKEN_MARKER, card)).toBe(true);
            expect(b.player.active.boardEffect.includes(card_types_1.BoardEffect.ABILITY_USED)).toBe(true);
            b.player.hand.cards = [new water_energy_1.WaterEnergy()];
            expect(() => card.reduceEffect(b.store, b.state, new game_effects_1.PowerEffect(b.player, card.powers[0], card))).toThrow();
        });
        it('does not grant Ninja Spinner bonus before the Energy actually returns for ' + Print.name, () => {
            const card = new Print();
            const b = battle(card);
            const energy = new water_energy_1.WaterEnergy();
            b.player.hand.cards = [energy, new water_energy_1.WaterEnergy()];
            b.player.hand.moveCardsTo(b.player.hand.cards.slice(), b.player.active);
            const effect = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
            card.reduceEffect(b.store, b.state, effect);
            expect(effect.damage).toBe(120);
            const confirm = b.state.prompts[0];
            b.store.dispatch(new resolve_prompt_action_1.ResolvePromptAction(confirm.id, true));
            expect(effect.damage).toBe(120);
            expect(b.player.hand.cards.length).toBe(0);
            const payment = b.state.prompts.find(p => p instanceof choose_energy_prompt_1.ChooseEnergyPrompt);
            const selected = [payment.energy.find(e => e.card === energy)];
            expect(payment.validate(selected)).toBe(true);
            b.store.dispatch(new resolve_prompt_action_1.ResolvePromptAction(payment.id, selected));
            // Both upstream branches and the printed English card specify +80, not +160.
            expect(effect.damage).toBe(200);
            expect(b.player.hand.cards).toEqual([energy]);
            expect(b.player.active.cards.includes(energy)).toBe(false);
            expect(b.player.active.energies.cards.includes(energy)).toBe(false);
        });
        it('keeps base Ninja Spinner damage when the bonus is declined for ' + Print.name, () => {
            const card = new Print();
            const b = battle(card);
            const effect = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
            card.reduceEffect(b.store, b.state, effect);
            b.store.dispatch(new resolve_prompt_action_1.ResolvePromptAction(b.state.prompts[0].id, false));
            expect(effect.damage).toBe(120);
            expect(b.state.prompts.some(p => p instanceof choose_energy_prompt_1.ChooseEnergyPrompt)).toBe(false);
        });
        it('does not grant Ninja Spinner bonus when no Water Energy can be returned for ' + Print.name, () => {
            const card = new Print();
            const b = battle(card);
            b.player.hand.cards = [new double_colorless_energy_1.DoubleColorlessEnergy()];
            b.player.hand.moveCardsTo(b.player.hand.cards.slice(), b.player.active);
            const effect = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
            card.reduceEffect(b.store, b.state, effect);
            b.store.dispatch(new resolve_prompt_action_1.ResolvePromptAction(b.state.prompts[0].id, true));
            const payment = b.state.prompts.find(p => p instanceof choose_energy_prompt_1.ChooseEnergyPrompt);
            expect(payment.validate([])).toBe(true);
            b.store.dispatch(new resolve_prompt_action_1.ResolvePromptAction(payment.id, []));
            expect(effect.damage).toBe(120);
            expect(b.player.hand.cards.length).toBe(0);
        });
    });
});
