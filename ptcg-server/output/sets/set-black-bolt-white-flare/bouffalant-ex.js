"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouffalantex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Bouffalantex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 220;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Bouffer',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'This Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Gold Breaker',
                cost: [C, C, C],
                damage: 100,
                text: 'If your opponent\'s Active Pokemon is a Pokemon ex, this attack does 100 more damage.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Bouffalant ex';
        this.fullName = 'Bouffalant ex SV11W';
    }
    reduceEffect(store, state, effect) {
        // Bouffer: reduce damage taken by 30 after Weakness/Resistance
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 30);
        }
        // Gold Breaker: +100 if opponent's Active is a Pokemon ex
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active.getPokemonCard();
            if (oppActive && oppActive.tags && oppActive.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                effect.damage += 100;
            }
        }
        return state;
    }
}
exports.Bouffalantex = Bouffalantex;
