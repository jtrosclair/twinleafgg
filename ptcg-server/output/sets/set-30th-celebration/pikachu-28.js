"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu28 = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #28 — Lonely Gaze + Pika Ball */
class Pikachu28 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Lonely Gaze',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon do 20 less damage (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Pika Ball',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 28';
    }
    reduceEffect(store, state, effect) {
        // Lonely Gaze
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const owner = game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this));
            if (!game_1.StateUtils.isPokemonInPlay(owner, this)) {
                return state;
            }
            if (owner.active.getPokemonCard() !== this) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, owner);
            if (effect.player !== opponent || effect.source !== opponent.active) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, this)) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 20);
        }
        return state;
    }
}
exports.Pikachu28 = Pikachu28;
