"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 90;
        this.retreat = [];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.attacks = [
            {
                name: 'Rule of Evil',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 60 damage to each Pokémon that has an Ability (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Slash',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Weavile';
        this.fullName = 'Weavile BUS';
        this.evolvesFrom = 'Sneasel';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // calculate damage for opponent
            const opponentActive = opponent.active.getPokemonCard();
            const stubPowerEffectForActive = new game_effects_1.PowerEffect(opponent, {
                name: 'test',
                powerType: game_1.PowerType.ABILITY,
                text: ''
            }, opponent.active.getPokemonCard());
            try {
                store.reduceEffect(state, stubPowerEffectForActive);
                if (opponentActive && opponentActive.powers.length) {
                    effect.damage = 60;
                }
            }
            catch (_a) {
                // no abilities in active
            }
            if (opponent.bench.some(b => b.cards.length > 0)) {
                const stubPowerEffectForBench = new game_effects_1.PowerEffect(opponent, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, opponent.bench.filter(b => b.cards.length > 0)[0].getPokemonCard());
                try {
                    store.reduceEffect(state, stubPowerEffectForBench);
                    const benched = opponent.bench.filter(b => b.cards.length > 0);
                    benched.forEach(target => {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    });
                }
                catch (_b) {
                    // no abilities on bench
                }
            }
            // calculate damage for player
            const active = player.active.getPokemonCard();
            const stubPowerEffectForMyActive = new game_effects_1.PowerEffect(player, {
                name: 'test',
                powerType: game_1.PowerType.ABILITY,
                text: ''
            }, player.active.getPokemonCard());
            try {
                store.reduceEffect(state, stubPowerEffectForMyActive);
                if (active && active.powers.length) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                    damageEffect.target = player.active;
                    store.reduceEffect(state, damageEffect);
                }
            }
            catch (_c) {
                // no abilities in active
            }
            if (player.bench.some(b => b.cards.length > 0)) {
                const stubForBench = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, player.bench.filter(b => b.cards.length > 0)[0].getPokemonCard());
                try {
                    store.reduceEffect(state, stubForBench);
                    const myBenched = player.bench.filter(b => b.cards.length > 0);
                    myBenched.forEach(target => {
                        const benchDamageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                        benchDamageEffect.target = target;
                        store.reduceEffect(state, benchDamageEffect);
                    });
                }
                catch (_d) {
                    // no abilities on bench
                }
            }
            return state;
        }
        return state;
    }
}
exports.Weavile = Weavile;
