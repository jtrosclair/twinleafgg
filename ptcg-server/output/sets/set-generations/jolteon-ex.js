"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JolteonEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class JolteonEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = L;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Swift',
                cost: [L],
                damage: 30,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Flash Ray',
                cost: [L, C, C],
                damage: 70,
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
            }];
        this.set = 'GEN';
        this.setNumber = '28';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jolteon-EX';
        this.fullName = 'Jolteon-EX GEN';
        this.FLASH_RAY_MARKER = 'FLASH_RAY_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_2.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 30);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.marker.addMarker(this.FLASH_RAY_MARKER, this);
            (0, prefabs_1.ADD_MARKER)(this.FLASH_RAY_MARKER, effect.opponent, this);
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect) && effect.target.getPokemonCard() === this && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
            if (this.marker.hasMarker(this.FLASH_RAY_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.FLASH_RAY_MARKER, effect.player, this)) {
            (0, prefabs_1.REMOVE_MARKER)(this.FLASH_RAY_MARKER, effect.player, this);
            this.marker.removeMarker(this.FLASH_RAY_MARKER, this);
        }
        return state;
    }
}
exports.JolteonEX = JolteonEX;
