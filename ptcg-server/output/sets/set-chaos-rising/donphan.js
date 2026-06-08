"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donphan = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Donphan extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Phanpy';
        this.hp = 150;
        this.cardType = F;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'No Reprieve',
                cost: [F],
                damage: 20,
                text: 'During your next turn, this Pokemon\'s attacks do 80 more damage to your opponent\'s Active Pokemon.'
            },
            {
                name: 'Smash Head',
                cost: [F, C, C, C],
                damage: 180,
                text: 'Discard 2 Energy attached to this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.usSetNumber = 'CRI 45';
        this.name = 'Donphan';
        this.fullName = 'Donphan M4';
        this.NO_REPRIEVE_MARKER = 'DONPHAN_M4_NO_REPRIEVE_MARKER';
        this.NO_REPRIEVE_CLEAR_MARKER = 'DONPHAN_M4_NO_REPRIEVE_CLEAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_MARKER)(this.NO_REPRIEVE_MARKER, effect.player, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.getPokemonCard() === this) {
            const player = game_1.StateUtils.findOwner(state, effect.source);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.target === opponent.active && ((0, prefabs_1.HAS_MARKER)(this.NO_REPRIEVE_MARKER, player, this) || (0, prefabs_1.HAS_MARKER)(this.NO_REPRIEVE_CLEAR_MARKER, player, this))) {
                effect.damage += 80;
            }
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.NO_REPRIEVE_CLEAR_MARKER, this);
        (0, prefabs_1.REPLACE_MARKER_AT_END_OF_TURN)(effect, this.NO_REPRIEVE_MARKER, this.NO_REPRIEVE_CLEAR_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
        }
        return state;
    }
}
exports.Donphan = Donphan;
