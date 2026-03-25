"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finizen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Finizen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Aqua Slash',
                cost: [W],
                damage: 30,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.setNumber = '59';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Finizen';
        this.fullName = 'Finizen TWM';
    }
    reduceEffect(store, state, effect) {
        // Aqua Slash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Finizen = Finizen;
