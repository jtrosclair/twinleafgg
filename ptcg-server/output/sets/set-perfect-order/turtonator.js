"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Turtonator = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Turtonator extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Thorny Shell',
                powerType: game_1.PowerType.ABILITY,
                text: 'When this Pokemon takes damage from an attack from your opponent\'s Pokemon while it is in the Active Spot, discard an Energy from the attacking Pokemon.'
            }];
        this.attacks = [{
                name: 'Heat Breath',
                cost: [R, R, C],
                damage: 80,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 80 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.usSetNumber = 'POR 17';
        this.name = 'Turtonator';
        this.fullName = 'Turtonator M3';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Thorny Shell ability - discard energy from attacking Pokemon when this takes damage
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = (_a = effect.source) === null || _a === void 0 ? void 0 : _a.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Check if this Pokemon is in Active Spot
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (player.active !== effect.target) {
                return state;
            }
            // Check if damage was dealt from opponent's attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            const sourceOwner = effect.source ? game_1.StateUtils.findOwner(state, effect.source) : null;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Only trigger from opponent's attacks
            if (sourceOwner !== opponent) {
                return state;
            }
            // Check if player has DAMAGE_DEALT_MARKER (damage was actually dealt)
            if (!player.marker.hasMarker(player.DAMAGE_DEALT_MARKER)) {
                return state;
            }
            if (sourceCard && effect.source && effect.source.energies.cards.length > 0) {
                // Try to reduce PowerEffect to check if ability is blocked
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_b) {
                    return state;
                }
                // Discard one energy from attacking Pokemon
                return store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, effect.source, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEffect.target = effect.source;
                        store.reduceEffect(state, discardEffect);
                    }
                });
            }
        }
        // Heat Breath - coin flip for +80 damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this) && effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                if (result === true) {
                    effect.damage += 80;
                }
            });
            return store.reduceEffect(state, coinFlipEffect);
        }
        return state;
    }
}
exports.Turtonator = Turtonator;
