"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinkatink = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tinkatink extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Boundless Power',
                cost: [P],
                damage: 40,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tinkatink';
        this.fullName = 'Tinkatink PAR';
    }
    reduceEffect(store, state, effect) {
        // Boundless Power
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Legacy implementation:
            // - Set player.active.cannotAttackNextTurnPending = true directly.
            //
            // Converted to prefab version (THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN).
            (0, prefabs_1.THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN)(player);
        }
        return state;
    }
}
exports.Tinkatink = Tinkatink;
