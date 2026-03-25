"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donphan = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Donphan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Phanpy';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Sturdy',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has full HP and would be Knocked Out by damage from an attack, this Pokémon is not Knocked Out and its remaining HP becomes 10.'
            }];
        this.attacks = [{
                name: 'Rolling Spin',
                cost: [F, C, C],
                damage: 70,
                text: 'During your next turn, this Pokémon\'s Rolling Spin attack does 70 more damage (before applying Weakness and Resistance).'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.name = 'Donphan';
        this.fullName = 'Donphan LOT';
        this.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
        this.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.SURVIVE_ON_TEN_IF_FULL_HP)(store, state, effect, {
            source: this,
            reason: this.powers[0].name
        });
        (0, prefabs_1.NEXT_TURN_ATTACK_BONUS)(effect, {
            attack: this.attacks[0],
            source: this,
            bonusDamage: 70,
            bonusMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER,
            clearMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER_2
        });
        return state;
    }
}
exports.Donphan = Donphan;
