"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeraoraV = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ZeraoraV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_V];
        this.cardType = L;
        this.hp = 210;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Claw Slash',
                cost: [L, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Thunderous Bolt',
                cost: [L, L, C],
                damage: 190,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'F';
        this.set = 'CRZ';
        this.name = 'Zeraora V';
        this.fullName = 'Zeraora V CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
    }
    reduceEffect(store, state, effect) {
        // Thunderous Bolt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.ZeraoraV = ZeraoraV;
