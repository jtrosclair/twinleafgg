"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragapultV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DragapultV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 210;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [P],
                damage: 30,
                text: ''
            },
            {
                name: 'Jet Assult',
                cost: [P, P],
                damage: 60,
                text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 80 more damage.'
            }
        ];
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Dragapult V';
        this.fullName = 'Dragapult V RCL';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = state.players.find(p => p.active.getPokemonCard() === this);
            if ((_a = this.wasMovedToActiveThisTurn) === null || _a === void 0 ? void 0 : _a.call(this, player)) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.DragapultV = DragapultV;
