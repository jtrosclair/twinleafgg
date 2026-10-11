"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const energy_card_1 = require("../../game/store/card/energy-card");
const card_types_1 = require("../../game/store/card/card-types");
const player_1 = require("../../game/store/state/player");
const state_1 = require("../../game/store/state/state");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const store_1 = require("../../game/store/store");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const resolve_prompt_action_1 = require("../../game/store/actions/resolve-prompt-action");
class TestPokemon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Test Pokémon';
        this.fullName = 'Test Pokémon';
        this.set = 'TEST';
        this.setNumber = '1';
        this.cardImage = '';
    }
}
class TestEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.name = 'Test Energy';
        this.fullName = 'Test Energy';
        this.set = 'TEST';
        this.setNumber = '2';
        this.cardImage = '';
    }
}
// Exact printed source: https://api.tcgdex.net/v2/en/cards/30th-{number}.
function battle(card) {
    const state = new state_1.State();
    const player = new player_1.Player();
    const opponent = new player_1.Player();
    player.id = 1;
    opponent.id = 2;
    state.players = [player, opponent];
    state.turn = 2;
    state.phase = state_1.GamePhase.ATTACK;
    player.active.cards = [card];
    const defender = new TestPokemon();
    defender.hp = 300;
    defender.name = 'Defender';
    opponent.active.cards = [defender];
    const store = new store_1.Store({ onStateChange: () => undefined });
    store.state = state;
    return { state, player, opponent, card, store };
}
function energy(type) {
    const card = new TestEnergy();
    card.provides = [type];
    return card;
}
function resolve(b, result) {
    const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
    // Run real callbacks, isolating unrelated prize/table checks.
    b.store.reducePrompt(b.state, new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result));
}
function attack(b, index = 0) {
    const effect = new game_effects_1.AttackEffect(b.player, b.opponent, b.card.attacks[index]);
    b.store.reduceEffect(b.state, effect);
    return effect;
}
function applyDamage(b, effect) {
    b.store.reduceEffect(b.state, new attack_effects_1.DealDamageEffect(effect, effect.damage));
}
describe('30C confirmed review fixes', () => {
    it('Salamence ex has printed effective HP 330', () => {
        const { Salamenceex } = require('../set-30th-celebration/salamence-ex');
        const b = battle(new Salamenceex());
        const check = new check_effects_1.CheckHpEffect(b.player, b.player.active);
        b.store.reduceEffect(b.state, check);
        expect(check.hp).toBe(330);
    });
    it('KommoO has printed effective HP 180', () => {
        const { KommoO } = require('../set-30th-celebration/kommo-o');
        const b = battle(new KommoO());
        const check = new check_effects_1.CheckHpEffect(b.player, b.player.active);
        b.store.reduceEffect(b.state, check);
        expect(check.hp).toBe(180);
    });
    it('Minior has printed effective HP 90', () => {
        const { Minior } = require('../set-30th-celebration/minior');
        const b = battle(new Minior());
        const check = new check_effects_1.CheckHpEffect(b.player, b.player.active);
        b.store.reduceEffect(b.state, check);
        expect(check.hp).toBe(90);
    });
    it('Maushold has printed effective HP 80', () => {
        const { Maushold } = require('../set-30th-celebration/maushold');
        const b = battle(new Maushold());
        const check = new check_effects_1.CheckHpEffect(b.player, b.player.active);
        b.store.reduceEffect(b.state, check);
        expect(check.hp).toBe(80);
    });
    it('Life-Locked blocks opposing Active healing when its owner sits second', () => {
        const { Yveltal } = require('../set-30th-celebration/yveltal');
        const b = battle(new Yveltal());
        b.state.players = [b.opponent, b.player];
        b.opponent.active.damage = 80;
        b.store.reduceEffect(b.state, new game_effects_1.HealEffect(b.opponent, b.opponent.active, 30));
        expect(b.opponent.active.damage).toBe(80);
    });
    it('Life-Locked blocks the opposing Active from either seat but not its Bench or owner', () => {
        const { Yveltal } = require('../set-30th-celebration/yveltal');
        for (const second of [false, true]) {
            const b = battle(new Yveltal());
            if (second)
                b.state.players = [b.opponent, b.player];
            b.opponent.active.damage = 80;
            b.player.active.damage = 80;
            const bench = new pokemon_card_list_1.PokemonCardList();
            bench.cards = [new TestPokemon()];
            bench.damage = 80;
            b.opponent.bench.push(bench);
            for (const target of [b.opponent.active, bench, b.player.active]) {
                b.store.reduceEffect(b.state, new game_effects_1.HealEffect(b.opponent, target, 30));
            }
            expect(b.opponent.active.damage).toBe(80);
            expect(bench.damage).toBe(50);
            expect(b.player.active.damage).toBe(50);
        }
    });
    it('Life-Locked respects ability blocking', () => {
        const { Yveltal } = require('../set-30th-celebration/yveltal');
        const b = battle(new Yveltal());
        b.state.players = [b.opponent, b.player];
        const { PowerEffect } = require('../../game/store/effects/game-effects');
        b.opponent.active.getPokemonCard().reduceEffect = (_store, state, effect) => {
            if (effect instanceof PowerEffect)
                throw new Error('Ability blocked');
            return state;
        };
        b.opponent.active.damage = 80;
        b.store.reduceEffect(b.state, new game_effects_1.HealEffect(b.opponent, b.opponent.active, 30));
        expect(b.opponent.active.damage).toBe(50);
    });
    it('Spark deals printed 20 Active damage even with no opposing Bench', () => {
        const { Pikachu25 } = require('../set-30th-celebration/pikachu-25');
        const b = battle(new Pikachu25());
        const effect = attack(b);
        applyDamage(b, effect);
        expect(b.opponent.active.damage).toBe(20);
        expect(b.store.hasPrompts()).toBe(false);
    });
    it('Spark additionally deals 20 to one Bench without applying Weakness or Resistance', () => {
        const { Pikachu25 } = require('../set-30th-celebration/pikachu-25');
        const b = battle(new Pikachu25());
        const bench = new pokemon_card_list_1.PokemonCardList();
        const target = new TestPokemon();
        target.hp = 200;
        target.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        target.resistance = [{ type: card_types_1.CardType.LIGHTNING, value: -30 }];
        bench.cards = [target];
        b.opponent.bench.push(bench);
        const effect = attack(b);
        resolve(b, [bench]);
        applyDamage(b, effect);
        expect(b.opponent.active.damage).toBe(20);
        expect(bench.damage).toBe(20);
    });
    it('Quick Attack flips only once: tails does 20 even if the next random roll is heads', () => {
        const { Eevee2 } = require('../set-30th-celebration/eevee-2');
        let roll = 0;
        const random = spyOn(Math, 'random').and.callFake(() => roll++ === 0 ? 0.9 : 0.1);
        const b = battle(new Eevee2());
        const effect = attack(b);
        while (b.store.hasPrompts())
            resolve(b, true);
        const flips = random.calls.count();
        expect(flips).toBe(1);
        applyDamage(b, effect);
        expect(b.opponent.active.damage).toBe(20);
        expect(b.card.attacks[0].text).toBe('Flip a coin. If heads, this attack does 20 more damage.');
    });
    it('Quick Attack does 40 on heads and 20 on tails for both Eevee prints', () => {
        const { Eevee2 } = require('../set-30th-celebration/eevee-2');
        const { Eevee118 } = require('../set-30th-celebration/other-prints');
        const random = spyOn(Math, 'random').and.returnValue(0.1);
        for (const Card of [Eevee2, Eevee118]) {
            for (const heads of [true, false]) {
                random.and.returnValue(heads ? 0.1 : 0.9);
                random.calls.reset();
                const b = battle(new Card());
                const effect = attack(b);
                resolve(b, true);
                const flips = random.calls.count();
                expect(b.store.hasPrompts()).toBe(false);
                expect(flips).toBe(1);
                applyDamage(b, effect);
                expect(b.opponent.active.damage).toBe(heads ? 40 : 20);
            }
        }
        expect(new Eevee2().fullName).toBe('Eevee2 30C');
        expect(new Eevee2().setNumber).toBe('117');
        expect(new Eevee118().fullName).toBe('Eevee 30C 2');
        expect(new Eevee118().setNumber).toBe('118');
    });
    it('Lightning Crash discards Lightning and both Rainbow Energy but retains unrelated Energy', () => {
        const { Pikachu51 } = require('../set-30th-celebration/pikachu-51');
        const { RainbowEnergy } = require('../set-sun-and-moon/rainbow-energy');
        const b = battle(new Pikachu51());
        const lightning = energy(card_types_1.CardType.LIGHTNING);
        const rainbows = [new RainbowEnergy(), new RainbowEnergy()];
        const fire = energy(card_types_1.CardType.FIRE);
        b.player.active.cards.push(lightning, ...rainbows, fire);
        attack(b);
        resolve(b, [b.opponent.active]);
        expect(b.player.discard.cards.length).toBe(3);
        for (const card of [lightning, ...rainbows])
            expect(b.player.discard.cards).toContain(card);
        expect(b.player.active.cards).toEqual([b.card, fire]);
        expect(b.opponent.active.damage).toBe(90);
    });
    it('Lightning Crash discards a dynamically supplied Lightning Energy only once', () => {
        const { Pikachu51 } = require('../set-30th-celebration/pikachu-51');
        const b = battle(new Pikachu51());
        const dynamic = energy(card_types_1.CardType.COLORLESS);
        dynamic.reduceEffect = (_store, state, effect) => {
            if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(dynamic)) {
                effect.energyMap.push({ card: dynamic, provides: [card_types_1.CardType.LIGHTNING] }, { card: dynamic, provides: [card_types_1.CardType.LIGHTNING] });
            }
            return state;
        };
        b.player.active.cards.push(dynamic);
        attack(b);
        resolve(b, [b.opponent.active]);
        expect(b.player.discard.cards).toEqual([dynamic]);
        expect(b.player.active.cards).toEqual([b.card]);
    });
    it('Lightning Crash does not discard Rainbow when Temple of Sinnoh makes it Colorless', () => {
        const { Pikachu51 } = require('../set-30th-celebration/pikachu-51');
        const { RainbowEnergy } = require('../set-sun-and-moon/rainbow-energy');
        const { TempleofSinnoh } = require('../set-astral-radiance/temple-of-sinnoh');
        const b = battle(new Pikachu51());
        const rainbow = new RainbowEnergy();
        b.player.stadium.cards = [new TempleofSinnoh()];
        b.player.active.cards.push(rainbow);
        attack(b);
        resolve(b, [b.opponent.active]);
        expect(b.player.active.cards).toEqual([b.card, rainbow]);
        expect(b.player.discard.cards.length).toBe(0);
    });
    it('Lightning Crash recognizes effective WLFM and LPM multi-type aliases', () => {
        const { Pikachu51 } = require('../set-30th-celebration/pikachu-51');
        const b = battle(new Pikachu51());
        const aliases = [energy(card_types_1.CardType.WLFM), energy(card_types_1.CardType.LPM)];
        const unrelated = energy(card_types_1.CardType.GRW);
        b.player.active.cards.push(...aliases, unrelated);
        attack(b);
        resolve(b, [b.opponent.active]);
        expect(b.player.discard.cards).toEqual(aliases);
        expect(b.player.active.cards).toEqual([b.card, unrelated]);
    });
    it('Pikachu 24 exposes only printed Volt Tackle and its 80/30 damage at attack index zero', () => {
        const { Pikachu24 } = require('../set-30th-celebration/pikachu-24');
        const b = battle(new Pikachu24());
        expect(b.card.attacks.map(a => a.name)).toEqual(['Volt Tackle']);
        expect(b.card.attacks[0].cost).toEqual([card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS]);
        const effect = attack(b);
        applyDamage(b, effect);
        expect(b.opponent.active.damage).toBe(80);
        expect(b.player.active.damage).toBe(30);
    });
});
