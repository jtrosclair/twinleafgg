"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XerneasEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class XerneasEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = Y;
        this.hp = 170;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Break Through',
                cost: [Y, C, C],
                damage: 60,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'X Blast',
                cost: [Y, Y, C, C],
                damage: 140,
                text: 'This Pokémon can\'t use X Blast during your next turn.'
            }];
        this.set = 'XY';
        this.name = 'Xerneas-EX';
        this.fullName = 'Xerneas-EX XY';
        this.setNumber = '97';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(30, effect, store, state);
        }
        // X Blast
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('X Blast')) {
                player.active.cannotUseAttacksNextTurnPending.push('X Blast');
            }
        }
        return state;
    }
}
exports.XerneasEX = XerneasEX;
