"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const energy_card_1 = require("../../game/store/card/energy-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const player_1 = require("../../game/store/state/player");
const state_1 = require("../../game/store/state/state");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const card_list_1 = require("../../game/store/state/card-list");
const store_1 = require("../../game/store/store");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const resolve_prompt_action_1 = require("../../game/store/actions/resolve-prompt-action");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const mew_ex_1 = require("../set-30th-celebration/mew-ex");
const unown_1 = require("../set-30th-celebration/unown");
const castform_snowy_form_1 = require("../set-chilling-reign/castform-snowy-form");
const furfrou_1 = require("../set-x-and-y/furfrou");
const alakazam_ex_1 = require("../set-pokemon-151/alakazam-ex");
const copy_attack_delegation_1 = require("../../game/store/prefabs/copy-attack-delegation");
class ReviewPokemon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Review Dummy';
        this.fullName = 'Review Dummy';
        this.set = 'TEST';
        this.hp = 300;
        this.attacks = [{ name: 'Hit', cost: [], damage: 10, text: '' }];
    }
}
class ReviewEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.name = 'Review Energy';
        this.fullName = 'Review Energy';
        this.set = 'TEST';
    }
}
class ReviewStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.name = 'Review Stadium';
        this.fullName = 'Review Stadium';
        this.set = 'TEST';
        this.trainerType = card_types_1.TrainerType.STADIUM;
    }
}
function energy(type) { const card = new ReviewEnergy(); card.provides = [type]; return card; }
function battle() {
    const state = new state_1.State();
    const player = new player_1.Player();
    const opponent = new player_1.Player();
    player.id = 1;
    opponent.id = 2;
    state.players = [player, opponent];
    state.turn = 2;
    state.phase = state_1.GamePhase.ATTACK;
    player.active.cards = [new ReviewPokemon()];
    opponent.active.cards = [new ReviewPokemon()];
    for (const p of state.players)
        p.prizes = Array.from({ length: 6 }, () => {
            const list = new card_list_1.CardList();
            list.cards = [new ReviewPokemon()];
            return list;
        });
    const store = new store_1.Store({ onStateChange: () => undefined });
    store.state = state;
    return { state, player, opponent, store };
}
function bench(b, card) {
    const slot = new pokemon_card_list_1.PokemonCardList();
    slot.cards = [card];
    b.player.bench.push(slot);
    return slot;
}
function resolve(b, result) {
    const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
    if (!prompt)
        throw new Error('Expected a pending prompt');
    // Real callbacks, isolated from unrelated legacy next-turn/table-state checks.
    return b.store.reducePrompt(b.state, new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result));
}
function chooseCopy(b, mew) {
    b.store.reduceEffect(b.state, new game_effects_1.PowerEffect(b.player, mew.powers[0], mew));
}
function copy(b, mew, source, index = 0) {
    chooseCopy(b, mew);
    resolve(b, source.attacks[index]);
}
function playStadium(b) {
    return b.store.dispatch(new play_card_action_1.PlayCardAction(b.player.id, 0, {
        player: play_card_action_1.PlayerType.BOTTOM_PLAYER, slot: play_card_action_1.SlotType.BOARD, index: 0
    }));
}
describe('confirmed engine review regressions', () => {
    beforeEach(() => (0, copy_attack_delegation_1.clearCopyAttackSessionsForTests)());
    it('keeps copied KO extra prizes when an unrelated Store runs during attack animation', () => {
        for (const interleave of [false, true]) {
            const b = battle();
            const mew = new mew_ex_1.Mewex();
            const source = new unown_1.Unown();
            b.player.active.cards = [mew, energy(card_types_1.CardType.PSYCHIC), energy(card_types_1.CardType.PSYCHIC)];
            bench(b, source);
            b.opponent.active.getPokemonCard().hp = 40;
            copy(b, mew, source);
            expect(b.opponent.active.damage).toBe(40);
            expect(b.store.hasPrompts()).toBe(true);
            if (interleave) {
                const other = battle();
                other.store.reduceEffect(other.state, new check_effects_1.CheckHpEffect(other.player, other.player.active));
            }
            const ko = new game_effects_1.KnockOutEffect(b.opponent, b.opponent.active);
            b.store.reduceEffect(b.state, ko);
            expect(ko.prizeCount).toBe(2);
        }
    });
    it('blocks copied Frosty Typhoon without Mew Energy despite source Weather Reading', () => {
        const b = battle();
        const mew = new mew_ex_1.Mewex();
        const source = new castform_snowy_form_1.CastformSnowyForm();
        b.player.active.cards = [mew];
        bench(b, source);
        b.player.discard.cards = Array.from({ length: 8 }, () => new ReviewStadium());
        const mewAttacks = mew.attacks;
        const sourceAttacks = source.attacks;
        chooseCopy(b, mew);
        const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
        expect(prompt.options.blocked).toEqual([{ index: 0, attack: 'Frosty Typhoon' }]);
        expect(() => resolve(b, source.attacks[0])).toThrow(jasmine.objectContaining({ message: 'NOT_ENOUGH_ENERGY' }));
        expect(b.opponent.active.damage).toBe(0);
        expect(mew.attacks).toBe(mewAttacks);
        expect(source.attacks).toBe(sourceAttacks);
    });
    it('does not grant source Fur Coat after copying Energy Cutoff', () => {
        spyOn(Math, 'random').and.returnValue(0.9);
        const b = battle();
        const mew = new mew_ex_1.Mewex();
        const source = new furfrou_1.Furfrou();
        b.player.active.cards = [mew, energy(card_types_1.CardType.PSYCHIC), energy(card_types_1.CardType.PSYCHIC), energy(card_types_1.CardType.PSYCHIC)];
        bench(b, source);
        copy(b, mew, source);
        resolve(b, true);
        // Finish the real animation callback without the pre-existing next-turn endGame(NONE) path.
        b.state.phase = state_1.GamePhase.FINISHED;
        resolve(b, null);
        b.state.activePlayer = 1;
        b.state.phase = state_1.GamePhase.ATTACK;
        const hit = new game_effects_1.AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 40, text: '' });
        b.store.reduceEffect(b.state, new attack_effects_1.DealDamageEffect(hit, 40));
        expect(b.player.active.damage).toBe(40);
        expect(source.powers[0].name).toBe('Fur Coat');
    });
    it('retains real Stadium and Tool cost reductions for copied attacks', () => {
        const { DimensionValley } = require('../set-phantom-forces/dimension-valley');
        const { CounterGain } = require('../set-lost-thunder/counter-gain');
        for (const modifier of ['stadium', 'tool']) {
            const b = battle();
            const mew = new mew_ex_1.Mewex();
            const source = new castform_snowy_form_1.CastformSnowyForm();
            b.player.active.cards = [mew, energy(card_types_1.CardType.WATER), energy(card_types_1.CardType.WATER)];
            bench(b, source);
            if (modifier === 'stadium')
                b.player.stadium.cards = [new DimensionValley()];
            else {
                b.player.active.tools = [new CounterGain()];
                b.opponent.prizes.pop();
            }
            chooseCopy(b, mew);
            const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
            expect(prompt.options.blocked).toEqual([]);
            resolve(b, source.attacks[0]);
            expect(b.opponent.active.damage).toBe(120);
            expect(mew.attacks[0].name).toBe('Teleportation Burst');
            expect(source.attacks[0].cost).toEqual([card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS]);
        }
    });
    it('evaluates a copycat attack-reference cost modifier in the copycat context', () => {
        // Synthetic Mew modifier isolates reference-based own-card cost matching.
        const b = battle();
        const mew = new mew_ex_1.Mewex();
        const source = new castform_snowy_form_1.CastformSnowyForm();
        b.player.active.cards = [mew, energy(card_types_1.CardType.WATER), energy(card_types_1.CardType.WATER)];
        bench(b, source);
        const originalReduce = mew.reduceEffect;
        mew.reduceEffect = function (store, state, effect) {
            if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index >= 0)
                    effect.cost.splice(index, 1);
            }
            return originalReduce.call(this, store, state, effect);
        };
        chooseCopy(b, mew);
        const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
        expect(prompt.options.blocked).toEqual([]);
        resolve(b, source.attacks[0]);
        expect(b.opponent.active.damage).toBe(120);
    });
    it('does not remove Weather Reading from normal non-copied Castform cost checks', () => {
        const b = battle();
        const source = new castform_snowy_form_1.CastformSnowyForm();
        b.player.active.cards = [source];
        b.player.discard.cards = Array.from({ length: 8 }, () => new ReviewStadium());
        const check = new check_effects_1.CheckAttackCostEffect(b.player, source.attacks[0]);
        b.store.reduceEffect(b.state, check);
        expect(check.cost).toEqual([]);
    });
    it('retains copied Harden delayed markers through incoming damage and opponent EndTurn cleanup', () => {
        const { Onix } = require('../set-evolutions/onix');
        const { EndTurnEffect } = require('../../game/store/effects/game-phase-effects');
        const b = battle();
        const mew = new mew_ex_1.Mewex();
        const source = new Onix();
        b.player.active.cards = [mew, energy(card_types_1.CardType.FIGHTING)];
        bench(b, source);
        copy(b, mew, source);
        expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, mew)).toBe(true);
        b.state.phase = state_1.GamePhase.FINISHED;
        resolve(b, null);
        b.state.activePlayer = 1;
        b.state.phase = state_1.GamePhase.ATTACK;
        const hit = new game_effects_1.AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 40, text: '' });
        b.store.reduceEffect(b.state, new attack_effects_1.DealDamageEffect(hit, 40));
        expect(b.player.active.damage).toBe(0);
        b.state.phase = state_1.GamePhase.FINISHED;
        b.store.reduceEffect(b.state, new EndTurnEffect(b.opponent));
        expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, mew)).toBe(false);
        b.state.phase = state_1.GamePhase.ATTACK;
        b.store.reduceEffect(b.state, new attack_effects_1.DealDamageEffect(hit, 40));
        expect(b.player.active.damage).toBe(40);
        expect(mew.attacks[0].name).toBe('Teleportation Burst');
    });
    it('leaves an actual Furfrou passive Ability working normally', () => {
        const b = battle();
        const source = new furfrou_1.Furfrou();
        b.player.active.cards = [source];
        const hit = new game_effects_1.AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 40, text: '' });
        b.store.reduceEffect(b.state, new attack_effects_1.DealDamageEffect(hit, 40));
        expect(b.player.active.damage).toBe(20);
    });
    it('pays for copied useOnBench attacks with active Mew Energy, not Alakazam Energy', () => {
        const b = battle();
        const mew = new mew_ex_1.Mewex();
        const source = new alakazam_ex_1.Alakazamex();
        b.player.active.cards = [mew, energy(card_types_1.CardType.PSYCHIC), energy(card_types_1.CardType.PSYCHIC)];
        const slot = bench(b, source);
        expect(() => copy(b, mew, source, 1)).not.toThrow();
        expect(b.opponent.active.damage).toBe(120);
        expect(b.player.active.triggerAttackAnimation).toBe(true);
        expect(slot.triggerAttackAnimation).toBe(false);
    });
    it('uses the copycat type and animation source for copied useOnBench attacks', () => {
        const b = battle();
        const mew = new mew_ex_1.Mewex();
        const source = new alakazam_ex_1.Alakazamex();
        // Labeled artificial Fire type isolates attacker identity, not printed Mew metadata.
        mew.cardType = card_types_1.CardType.FIRE;
        b.opponent.active.getPokemonCard().weakness = [{ type: card_types_1.CardType.FIRE }];
        b.player.active.cards = [mew, energy(card_types_1.CardType.PSYCHIC), energy(card_types_1.CardType.PSYCHIC)];
        const slot = bench(b, source);
        slot.cards.push(energy(card_types_1.CardType.PSYCHIC), energy(card_types_1.CardType.PSYCHIC));
        copy(b, mew, source, 1);
        expect(b.opponent.active.damage).toBe(240);
        expect(b.player.active.triggerAttackAnimation).toBe(true);
        expect(slot.triggerAttackAnimation).toBe(false);
    });
    it('preserves ordinary non-delegated useOnBench attacker selection', () => {
        const b = battle();
        const source = new alakazam_ex_1.Alakazamex();
        const slot = bench(b, source);
        slot.cards.push(energy(card_types_1.CardType.PSYCHIC), energy(card_types_1.CardType.PSYCHIC));
        b.store.reduceEffect(b.state, new game_effects_1.UseAttackEffect(b.player, source.attacks[1]));
        expect(slot.triggerAttackAnimation).toBe(true);
        expect(b.player.active.triggerAttackAnimation).toBe(false);
        b.state.phase = state_1.GamePhase.FINISHED;
        resolve(b, null);
        expect(b.opponent.active.damage).toBe(120);
    });
    it('releases cancelled Stadium allowance through PlayCardAction and permits a subsequent heads play', () => {
        const random = spyOn(Math, 'random').and.returnValue(0.9);
        const b = battle();
        b.state.phase = state_1.GamePhase.PLAYER_TURN;
        b.player.coinFlipCancelTrainerPlayTurnsRemaining = 1;
        const old = new ReviewStadium();
        old.name = 'Old';
        b.opponent.stadium.cards = [old];
        const failed = new ReviewStadium();
        failed.name = 'Failed';
        const next = new ReviewStadium();
        next.name = 'Next';
        b.player.hand.cards = [failed, next];
        const previousAllowance = b.player.stadiumPlayedTurn;
        playStadium(b);
        resolve(b, true);
        expect(b.player.discard.cards).toContain(failed);
        expect(b.opponent.stadium.cards).toEqual([old]);
        expect(b.player.stadiumPlayedTurn).toBe(previousAllowance);
        random.and.returnValue(0.1);
        expect(() => playStadium(b)).not.toThrow();
        if (b.store.hasPrompts())
            resolve(b, true);
        expect(b.player.stadium.cards).toEqual([next]);
        expect(b.opponent.stadium.cards).toEqual([]);
        expect(b.opponent.discard.cards).toContain(old);
        expect(b.player.stadiumPlayedTurn).toBe(b.state.turn);
    });
});
