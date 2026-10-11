"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const player_1 = require("../../game/store/state/player");
const state_1 = require("../../game/store/state/state");
const store_1 = require("../../game/store/store");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const resolve_prompt_action_1 = require("../../game/store/actions/resolve-prompt-action");
const snorlax_1 = require("../set-30th-celebration/snorlax");
class CheckupOpponent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Opponent';
        this.fullName = 'Checkup Opponent';
        this.hp = 300;
        this.set = 'TEST';
        this.setNumber = '1';
        this.cardImage = '';
    }
}
function asleepSnorlax() {
    const state = new state_1.State();
    const player = new player_1.Player();
    const opponent = new player_1.Player();
    player.id = 1;
    opponent.id = 2;
    state.players = [player, opponent];
    state.turn = 2;
    state.phase = state_1.GamePhase.BETWEEN_TURNS;
    const card = new snorlax_1.Snorlax();
    player.active.cards = [card];
    player.active.damage = 100;
    player.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
    opponent.active.cards = [new CheckupOpponent()];
    const store = new store_1.Store({ onStateChange: () => undefined });
    store.state = state;
    return { state, player, opponent, store, card };
}
function resolveSleep(b, heads) {
    const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
    b.store.reducePrompt(b.state, new resolve_prompt_action_1.ResolvePromptAction(prompt.id, heads));
}
// Real Checkup condition callbacks must precede Good Sleep and the KO scan.
describe('30C Good Sleep checkup ordering', () => {
    it('does not heal before the engine sleep prompt resolves', () => {
        const b = asleepSnorlax();
        b.store.reduceEffect(b.state, new game_phase_effects_1.BetweenTurnsEffect(b.player));
        expect(b.store.hasPrompts()).toBe(true);
        expect(b.player.active.damage).toBe(100);
    });
    it('waking heads leaves the original damage unchanged', () => {
        const b = asleepSnorlax();
        b.store.reduceEffect(b.state, new game_phase_effects_1.BetweenTurnsEffect(b.player));
        resolveSleep(b, true);
        expect(b.player.active.specialConditions).not.toContain(card_types_1.SpecialCondition.ASLEEP);
        expect(b.player.active.damage).toBe(100);
    });
    it('remaining asleep on tails heals all damage', () => {
        const b = asleepSnorlax();
        b.store.reduceEffect(b.state, new game_phase_effects_1.BetweenTurnsEffect(b.player));
        resolveSleep(b, false);
        expect(b.player.active.specialConditions).toContain(card_types_1.SpecialCondition.ASLEEP);
        expect(b.player.active.damage).toBe(0);
    });
    it('handles preset sleep results without creating a second sleep flip', () => {
        for (const heads of [true, false]) {
            const b = asleepSnorlax();
            const checkup = new game_phase_effects_1.BetweenTurnsEffect(b.player);
            checkup.asleepFlipResult = heads;
            b.store.reduceEffect(b.state, checkup);
            expect(b.store.hasPrompts()).toBe(false);
            expect(b.player.active.damage).toBe(heads ? 100 : 0);
        }
    });
    it('heals after both real condition prompts but before the global KO scan and continuation', () => {
        const b = asleepSnorlax();
        b.player.active.damage = 150;
        b.player.active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
        b.player.active.poisonDamage = 20;
        const opponentSnorlax = new snorlax_1.Snorlax();
        b.opponent.active.cards = [opponentSnorlax];
        b.opponent.active.damage = 100;
        b.opponent.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        const { CardList } = require('../../game/store/state/card-list');
        for (const player of b.state.players) {
            player.prizes = Array.from({ length: 6 }, () => {
                const prize = new CardList();
                prize.cards = [new CheckupOpponent()];
                return prize;
            });
        }
        const { betweenTurns } = require('../../game/store/effect-reducers/game-phase-effect');
        let continued = false;
        betweenTurns(b.store, b.state, () => { continued = true; });
        expect(b.player.active.damage).toBe(170);
        expect(continued).toBe(false);
        resolveSleep(b, false); // opponent's actual engine sleep prompt
        expect(b.opponent.active.damage).toBe(0);
        expect(continued).toBe(false);
        resolveSleep(b, false); // player's actual engine sleep prompt
        expect(b.player.active.damage).toBe(0);
        expect(b.player.active.getPokemonCard()).toBe(b.card);
        expect(b.player.discard.cards).not.toContain(b.card);
        expect(continued).toBe(true);
    });
    it('waits for Burn and Sleep results before dispatching the post-checkup event', () => {
        const b = asleepSnorlax();
        b.player.active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
        b.store.reduceEffect(b.state, new game_phase_effects_1.BetweenTurnsEffect(b.player));
        resolveSleep(b, false); // the final registered prompt is Burn; Sleep is still outstanding
        expect(b.player.active.damage).toBe(120);
        resolveSleep(b, false);
        expect(b.player.active.damage).toBe(0);
    });
});
