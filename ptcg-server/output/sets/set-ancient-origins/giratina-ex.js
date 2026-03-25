"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiratinaEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GiratinaEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 170;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Renegade Pulse',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks, including damage, done to this Pokémon by your opponent\'s Mega Evolution Pokémon.'
            }];
        this.attacks = [{
                name: 'Chaos Wheel',
                cost: [G, P, C, C],
                damage: 100,
                text: 'Your opponent can\'t play any Pokémon Tool, Special Energy, or Stadium cards from his or her hand during his or her next turn.'
            }];
        this.set = 'AOR';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Giratina-EX';
        this.fullName = 'Giratina EX AOR';
    }
    reduceEffect(store, state, effect) {
        // Renegade Pulse
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard === null || sourceCard === void 0 ? void 0 : sourceCard.tags.includes(card_types_1.CardTag.MEGA)) {
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        // Chaos Wheel
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(opponent.ATTACK_EFFECT_TOOL_LOCK, this, 'attack', 'player');
            opponent.marker.addMarker(opponent.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK, this, 'attack', 'player');
            opponent.marker.addMarker(opponent.ATTACK_EFFECT_STADIUM_LOCK, this, 'attack', 'player');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(player.ATTACK_EFFECT_TOOL_LOCK, this);
            player.marker.removeMarker(player.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK, this);
            player.marker.removeMarker(player.ATTACK_EFFECT_STADIUM_LOCK, this);
        }
        return state;
    }
}
exports.GiratinaEX = GiratinaEX;
