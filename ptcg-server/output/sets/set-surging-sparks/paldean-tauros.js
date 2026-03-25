"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaldeanTauros = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PaldeanTauros extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rear Kick',
                cost: [R],
                damage: 30,
                text: ''
            },
            {
                name: 'Spirited Tackle',
                cost: [R, C, C],
                damage: 90,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Stage 1 Pokémon, this attack does 90 more damage.'
            }];
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Paldean Tauros';
        this.fullName = 'Paldean Tauros SSP';
        this.regulationMark = 'H';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_1) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.PaldeanTauros = PaldeanTauros;
