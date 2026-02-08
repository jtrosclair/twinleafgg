"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaCharizardYex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class MegaCharizardYex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 360;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Explosion Y',
                cost: [R, R, C],
                damage: 0,
                text: 'Discard 3 Energy from this Pokémon, and this attack does 280 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Charizard Y ex';
        this.fullName = 'Mega Charizard Y ex MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 3);
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(280, effect, store, state);
        }
        return state;
    }
}
exports.MegaCharizardYex = MegaCharizardYex;
