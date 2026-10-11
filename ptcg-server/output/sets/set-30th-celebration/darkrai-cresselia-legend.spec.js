"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const card_types_1 = require("../../game/store/card/card-types");
const player_1 = require("../../game/store/state/player");
const state_1 = require("../../game/store/state/state");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const store_1 = require("../../game/store/store");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const lightning_energy_1 = require("../set-scarlet-and-violet-energy/lightning-energy");
const mewtwo_1 = require("./mewtwo");
function halves() {
    const file = 'darkrai-cresselia-legend';
    if (!fs.existsSync(path.join(__dirname, file + '.ts'))) {
        return [];
    }
    const constructors = require('./' + file);
    return [new constructors.DarkraiCresseliaLegendTopCC16(), new constructors.DarkraiCresseliaLegendBottomCC17()];
}
function battle() {
    const state = new state_1.State();
    const player = new player_1.Player();
    player.id = 1;
    const opponent = new player_1.Player();
    opponent.id = 2;
    state.players = [player, opponent];
    state.turn = 2;
    state.phase = state_1.GamePhase.PLAYER_TURN;
    for (const p of state.players) {
        p.bench = Array.from({ length: 5 }, () => new pokemon_card_list_1.PokemonCardList());
        p.active.cards = [new mewtwo_1.Mewtwo()];
        p.prizes = Array.from({ length: 6 }, () => { const list = new pokemon_card_list_1.PokemonCardList(); list.cards = [new lightning_energy_1.LightningEnergy()]; return list; });
        p.deck.cards = [new lightning_energy_1.LightningEnergy(), new lightning_energy_1.LightningEnergy()];
    }
    const store = new store_1.Store({ onStateChange: () => undefined });
    store.state = state;
    return { state, player, opponent, store };
}
describe('30C Darkrai & Cresselia LEGEND', () => {
    it('pays two attached Energy to the Lost Zone before damage and refuses cancellation', () => {
        const pair = halves();
        expect(pair.length).toBe(2);
        if (pair.length !== 2) {
            return;
        }
        const b = battle();
        const card = pair[0];
        b.player.active.cards = [pair[1], card];
        const energy = Array.from({ length: 4 }, () => new lightning_energy_1.LightningEnergy());
        b.player.active.cards.push(...energy);
        const attack = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
        b.store.reduceEffect(b.state, attack);
        expect(b.state.prompts.length).toBe(1);
        if (b.state.prompts.length !== 1) {
            return;
        }
        const prompt = b.state.prompts[0];
        expect(prompt.cost).toEqual([card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS]);
        expect(prompt.options.allowCancel).toBe(false);
        expect(prompt.validate(null, b.state)).toBe(false);
        expect(b.opponent.active.damage).toBe(0);
        expect(b.player.lostzone.cards.length).toBe(0);
        expect(attack.damage).toBe(0);
        expect(prompt.validate(prompt.decode([0, 0]), b.state)).toBe(false);
        const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
        expect(() => b.store.dispatch(new ResolvePromptAction(prompt.id, null))).toThrow();
        expect(b.player.lostzone.cards.length).toBe(0);
        b.store.dispatch(new ResolvePromptAction(prompt.id, prompt.decode([0, 1])));
        expect(b.player.lostzone.cards).toEqual(energy.slice(0, 2));
        expect(b.player.active.cards.includes(energy[0])).toBe(false);
        expect(b.player.active.cards.includes(energy[1])).toBe(false);
        expect(b.player.discard.cards.length).toBe(0);
        expect(attack.damage).toBe(100);
    });
    it('routes a Lost Crisis damage KO and every attachment to Lost Zone through the real attack lifecycle', () => {
        const pair = halves();
        expect(pair.length).toBe(2);
        if (pair.length !== 2) {
            return;
        }
        const b = battle();
        const card = pair[0];
        b.player.active.cards = [pair[1], card];
        const DarkEnergy = require('../set-scarlet-and-violet-energy/darkness-energy').DarknessEnergy;
        b.player.active.cards.push(...Array.from({ length: 4 }, () => new DarkEnergy()));
        const target = b.opponent.active.getPokemonCard();
        target.hp = 100;
        target.weakness = [];
        const previousStage = new mewtwo_1.Mewtwo();
        b.opponent.active.cards.unshift(previousStage);
        const attached = new lightning_energy_1.LightningEnergy();
        b.opponent.active.cards.push(attached);
        const tool = new (require('../set-plasma-freeze/float-stone').FloatStone)();
        b.opponent.active.tools = [tool];
        // Attachments may be mirrored in the main list and secondary references.
        b.opponent.active.cards.push(tool);
        b.opponent.active.energies.cards.push(attached);
        const energyPokemon = new mewtwo_1.Mewtwo();
        b.opponent.active.energies.cards.push(energyPokemon);
        const nested = new lightning_energy_1.LightningEnergy();
        target.cards.cards.push(nested);
        b.opponent.bench[0].cards = [new mewtwo_1.Mewtwo()];
        const UseAttackEffect = require('../../game/store/effects/game-effects').UseAttackEffect;
        const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
        b.store.reduceEffect(b.state, new UseAttackEffect(b.player, card.attacks[0]));
        const payment = b.state.prompts[0];
        expect(payment.type).toBe('Choose energy');
        b.store.dispatch(new ResolvePromptAction(payment.id, payment.decode([0, 1])));
        expect(b.opponent.active.damage).toBe(0);
        const animation = b.state.prompts.find(p => p.result === undefined);
        b.store.dispatch(new ResolvePromptAction(animation.id, null));
        for (const attachedCard of [target, previousStage, attached, tool, energyPokemon, nested]) {
            expect(b.opponent.lostzone.cards.includes(attachedCard)).toBe(true, attachedCard.fullName);
        }
        expect(new Set(b.opponent.lostzone.cards).size).toBe(6);
        expect(b.opponent.discard.cards.length).toBe(0);
        expect(b.opponent.active.cards.length).toBe(0);
        expect(b.opponent.active.tools.length).toBe(0);
        expect(b.opponent.active.energies.cards.length).toBe(0);
        expect(target.cards.cards.length).toBe(0);
        expect(b.player.getPrizeLeft()).toBe(5);
    });
    it('redistributes only existing opposing counters to other occupied Pokemon, preserving total', () => {
        const pair = halves();
        expect(pair.length).toBe(2);
        if (pair.length !== 2) {
            return;
        }
        const b = battle();
        const card = pair[0];
        b.player.active.cards = [pair[1], card];
        b.opponent.active.damage = 30;
        b.opponent.bench[0].cards = [new mewtwo_1.Mewtwo()];
        b.opponent.bench[0].damage = 10;
        b.store.reduceEffect(b.state, new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[1]));
        expect(b.state.prompts.length).toBe(1);
        if (!b.state.prompts.length) {
            return;
        }
        const prompt = b.state.prompts[0];
        const from = { player: 1, slot: 'active', index: 0 };
        const to = { player: 1, slot: 'bench', index: 0 };
        // Use actual enum values rather than display labels.
        const { PlayerType, SlotType } = require('../../game/store/actions/play-card-action');
        from.player = to.player = PlayerType.TOP_PLAYER;
        from.slot = SlotType.ACTIVE;
        to.slot = SlotType.BENCH;
        expect(prompt.validate([{ from, to: from }], b.state)).toBe(false);
        expect(prompt.validate([{ from, to: Object.assign(Object.assign({}, to), { index: 1 }) }], b.state)).toBe(false);
        expect(prompt.validate([{ from, to: Object.assign(Object.assign({}, to), { player: PlayerType.BOTTOM_PLAYER }) }], b.state)).toBe(false);
        expect(prompt.validate(Array.from({ length: 4 }, () => ({ from, to })), b.state)).toBe(false);
        const transfers = [{ from, to }, { from, to }];
        expect(prompt.validate(transfers, b.state)).toBe(true);
        const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
        b.store.dispatch(new ResolvePromptAction(prompt.id, transfers));
        expect(b.opponent.active.damage).toBe(10);
        expect(b.opponent.bench[0].damage).toBe(30);
        expect(b.opponent.active.damage + b.opponent.bench[0].damage).toBe(40);
        expect(b.player.active.damage).toBe(0);
    });
    it('refuses a missing counterpart, a same-half duplicate, an in-play half, and a full Bench without mutating hand', () => {
        for (const scenario of ['missing', 'same', 'in-play', 'full']) {
            const pair = halves();
            const b = battle();
            const card = pair[0];
            b.player.hand.cards = scenario === 'missing' ? [card]
                : scenario === 'same' ? [card, halves()[0]] : [...pair];
            if (scenario === 'full') {
                b.player.bench.forEach(slot => slot.cards = [new mewtwo_1.Mewtwo()]);
            }
            if (scenario === 'in-play') {
                b.player.hand.cards = [pair[1]];
                b.player.active.cards = [card];
            }
            const hand = [...b.player.hand.cards];
            expect(() => b.store.reduceEffect(b.state, new game_effects_1.PowerEffect(b.player, card.powers[0], card))).toThrow();
            expect(b.player.hand.cards).toEqual(hand);
        }
    });
    it('cannot play either half independently as a Basic Pokemon', () => {
        const PlayPokemonEffect = require('../../game/store/effects/play-card-effects').PlayPokemonEffect;
        for (const card of halves()) {
            const b = battle();
            b.player.hand.cards = [card];
            expect(() => b.store.reduceEffect(b.state, new PlayPokemonEffect(b.player, card, b.player.bench[0]))).toThrow();
            expect(b.player.bench[0].cards.length).toBe(0);
        }
    });
    it('does not Lost Zone effect-induced, pre-existing, checkup, or later-attack knockouts', () => {
        const { PutDamageEffect, PutCountersEffect } = require('../../game/store/effects/attack-effects');
        const { checkState } = require('../../game/store/effect-reducers/check-effect');
        const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
        for (const scenario of ['counters', 'damage-then-counters', 'already-ko', 'checkup', 'later-attack']) {
            const pair = halves();
            const b = battle();
            const card = pair[0];
            b.player.active.cards = [pair[1], card];
            b.player.active.cards.push(new lightning_energy_1.LightningEnergy(), new lightning_energy_1.LightningEnergy());
            b.state.phase = state_1.GamePhase.ATTACK;
            const target = b.opponent.active.getPokemonCard();
            target.hp = 100;
            target.weakness = [];
            b.opponent.bench[0].cards = [new mewtwo_1.Mewtwo()];
            const attack = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
            b.store.reduceEffect(b.state, attack);
            const payment = b.state.prompts[0];
            b.store.dispatch(new ResolvePromptAction(payment.id, payment.decode([0, 1])));
            if (scenario === 'counters') {
                b.store.reduceEffect(b.state, new PutCountersEffect(attack, 100));
            }
            else if (scenario === 'damage-then-counters') {
                b.store.reduceEffect(b.state, new PutDamageEffect(attack, 90));
                b.store.reduceEffect(b.state, new PutCountersEffect(attack, 10));
            }
            else if (scenario === 'already-ko') {
                b.opponent.active.damage = 100;
                b.store.reduceEffect(b.state, new PutDamageEffect(attack, 10));
            }
            else if (scenario === 'checkup') {
                b.state.phase = state_1.GamePhase.BETWEEN_TURNS;
                b.opponent.active.damage = 100;
            }
            else {
                b.store.reduceEffect(b.state, new PutDamageEffect(attack, 10));
                checkState(b.store, b.state);
                const later = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
                b.store.reduceEffect(b.state, new PutDamageEffect(later, 90));
            }
            checkState(b.store, b.state);
            expect(b.opponent.lostzone.cards.includes(target)).toBe(false, scenario);
            expect(b.opponent.discard.cards.includes(target)).toBe(true, scenario);
        }
    });
    it('does not arm Lost Crisis after insufficient energy or prevented damage', () => {
        const { PutDamageEffect } = require('../../game/store/effects/attack-effects');
        const { checkState } = require('../../game/store/effect-reducers/check-effect');
        const pair = halves();
        const b = battle();
        const card = pair[0];
        b.player.active.cards = [pair[1], card];
        b.player.active.cards.push(new lightning_energy_1.LightningEnergy());
        const attack = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
        expect(() => b.store.reduceEffect(b.state, attack)).toThrow();
        expect(attack.damageKnockOutsToLostZone).toBe(false);
        b.opponent.active.preventDamageNextTurn = true;
        const target = b.opponent.active.getPokemonCard();
        b.store.reduceEffect(b.state, new PutDamageEffect(attack, 999));
        checkState(b.store, b.state);
        expect(b.opponent.active.getPokemonCard()).toBe(target);
        expect(b.opponent.active.damage).toBe(0);
        expect(b.opponent.lostzone.cards.length).toBe(0);
    });
    it('Moon\'s Invite resolves effect KOs through ordinary discard and takes both LEGEND prizes', () => {
        const pair = halves();
        const b = battle();
        const card = pair[0];
        b.player.active.cards = [pair[1], card];
        b.opponent.active.damage = 20;
        const victimPair = halves();
        const victim = b.opponent.bench[0];
        victim.cards = [victimPair[1], victimPair[0]];
        victim.damage = 140;
        const energy = new lightning_energy_1.LightningEnergy();
        victim.cards.push(energy);
        b.state.phase = state_1.GamePhase.ATTACK;
        b.store.reduceEffect(b.state, new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[1]));
        const { PlayerType, SlotType } = require('../../game/store/actions/play-card-action');
        const from = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
        const to = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
        const prompt = b.state.prompts[0];
        const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
        b.store.dispatch(new ResolvePromptAction(prompt.id, [{ from, to }]));
        expect(victim.cards.length).toBe(0);
        expect(b.opponent.lostzone.cards.length).toBe(0);
        for (const c of [...victimPair, energy]) {
            expect(b.opponent.discard.cards.includes(c)).toBe(true);
        }
        expect(b.player.getPrizeLeft()).toBe(4);
    });
    it('Moon\'s Invite may be canceled and is a no-op with zero damage or fewer than two opposing Pokemon', () => {
        for (const scenario of ['cancel', 'zero', 'one', 'empty']) {
            const pair = halves();
            const b = battle();
            const card = pair[0];
            b.player.active.cards = [pair[1], card];
            if (scenario !== 'empty') {
                b.opponent.active.damage = scenario === 'zero' ? 0 : 20;
            }
            if (scenario === 'cancel' || scenario === 'zero') {
                b.opponent.bench[0].cards = [new mewtwo_1.Mewtwo()];
            }
            if (scenario === 'empty') {
                b.opponent.active.cards = [];
            }
            b.store.reduceEffect(b.state, new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[1]));
            if (scenario === 'cancel') {
                const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
                b.store.dispatch(new ResolvePromptAction(b.state.prompts[0].id, null));
                expect(b.opponent.active.damage).toBe(20);
            }
            else {
                expect(b.state.prompts.length).toBe(0, scenario);
            }
        }
    });
    it('Moon\'s Invite cannot move counters onto or off Pokemon protected from attack effects', () => {
        for (const protectedSide of ['from', 'to']) {
            const pair = halves();
            const b = battle();
            const card = pair[0];
            b.player.active.cards = [pair[1], card];
            b.opponent.active.damage = 20;
            b.opponent.bench[0].cards = [new mewtwo_1.Mewtwo()];
            (protectedSide === 'from' ? b.opponent.active : b.opponent.bench[0]).preventEffectsOfAttacksNextTurn = true;
            b.store.reduceEffect(b.state, new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[1]));
            const { PlayerType, SlotType } = require('../../game/store/actions/play-card-action');
            const from = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
            const to = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
            const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
            b.store.dispatch(new ResolvePromptAction(b.state.prompts[0].id, [{ from, to }]));
            expect(b.opponent.active.damage).toBe(20, protectedSide);
            expect(b.opponent.bench[0].damage).toBe(0, protectedSide);
        }
    });
    it('clears Lost Crisis destination after a saved damage KO and does not affect an unrelated simultaneous KO', () => {
        const { PutDamageEffect } = require('../../game/store/effects/attack-effects');
        const { checkState } = require('../../game/store/effect-reducers/check-effect');
        const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
        const pair = halves();
        const b = battle();
        const card = pair[0];
        b.player.active.cards = [pair[1], card];
        b.player.active.cards.push(new lightning_energy_1.LightningEnergy(), new lightning_energy_1.LightningEnergy());
        b.state.phase = state_1.GamePhase.ATTACK;
        const target = b.opponent.active.getPokemonCard();
        target.hp = 100;
        target.weakness = [];
        const unrelated = new mewtwo_1.Mewtwo();
        b.opponent.bench[0].cards = [unrelated];
        const attack = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
        b.store.reduceEffect(b.state, attack);
        const payment = b.state.prompts[0];
        b.store.dispatch(new ResolvePromptAction(payment.id, payment.decode([0, 1])));
        b.store.reduceEffect(b.state, new PutDamageEffect(attack, 100));
        // Simulate a post-damage saving effect before the KO state check.
        b.opponent.active.damage = 50;
        b.opponent.bench[0].damage = unrelated.hp;
        checkState(b.store, b.state);
        expect(b.opponent.lostzone.cards.length).toBe(0);
        expect(b.opponent.discard.cards.includes(unrelated)).toBe(true);
        expect(b.opponent.active.attackDamageKnockOut.destination).toBeUndefined();
        b.opponent.active.damage = 100;
        checkState(b.store, b.state);
        expect(b.opponent.discard.cards.includes(target)).toBe(true);
        expect(b.opponent.lostzone.cards.length).toBe(0);
    });
    it('counts Double Colorless as two Energy and moves its physical card only once', () => {
        const pair = halves();
        const b = battle();
        const card = pair[0];
        b.player.active.cards = [pair[1], card];
        const energy = new (require('../set-base-set/double-colorless-energy').DoubleColorlessEnergy)();
        b.player.active.cards.push(energy);
        const attack = new game_effects_1.AttackEffect(b.player, b.opponent, card.attacks[0]);
        b.store.reduceEffect(b.state, attack);
        const payment = b.state.prompts[0];
        const selected = payment.decode([0]);
        expect(payment.validate(selected)).toBe(true);
        const ResolvePromptAction = require('../../game/store/actions/resolve-prompt-action').ResolvePromptAction;
        b.store.dispatch(new ResolvePromptAction(payment.id, selected));
        expect(b.player.lostzone.cards).toEqual([energy]);
        expect(attack.damage).toBe(100);
        expect(b.player.active.cards.includes(energy)).toBe(false);
    });
    it('assembles either played half with its counterpart from hand into one 150 HP dual-type two-prize Pokemon', () => {
        expect(halves().length).toBe(2);
        for (const index of [0, 1]) {
            const pair = halves();
            if (pair.length !== 2) {
                return;
            }
            const b = battle();
            b.player.hand.cards = [...pair];
            b.store.reduceEffect(b.state, new game_effects_1.PowerEffect(b.player, pair[index].powers[0], pair[index]));
            expect(b.player.hand.cards.length).toBe(0);
            expect(b.player.bench.filter(slot => !!slot.getPokemonCard()).length).toBe(1);
            const composite = b.player.bench[0];
            expect(composite.cards).toEqual([pair[1], pair[0]]);
            expect(composite.pokemonPlayedTurn).toBe(b.state.turn);
            const hp = new check_effects_1.CheckHpEffect(b.player, composite);
            b.store.reduceEffect(b.state, hp);
            expect(hp.hp).toBe(150);
            const types = new check_effects_1.CheckPokemonTypeEffect(composite);
            b.store.reduceEffect(b.state, types);
            expect(types.cardTypes).toEqual([card_types_1.CardType.DARK, card_types_1.CardType.PSYCHIC]);
            expect(pair[0].weakness).toEqual([{ type: card_types_1.CardType.FIGHTING }, { type: card_types_1.CardType.PSYCHIC }]);
            expect(pair[0].stage).toBe(card_types_1.Stage.LEGEND);
            expect(pair[0].tags).toContain(card_types_1.CardTag.DUAL_LEGEND);
            expect(pair[0].retreat).toEqual([card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS]);
            const ko = new game_effects_1.KnockOutEffect(b.player, composite);
            b.store.reduceEffect(b.state, ko);
            expect(ko.prizeCount).toBe(2);
            expect(b.player.discard.cards).toContain(pair[0]);
            expect(b.player.discard.cards).toContain(pair[1]);
        }
    });
});
