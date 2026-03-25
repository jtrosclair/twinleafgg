"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tranquill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tranquill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidove';
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Speed Dive',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Jet Wing',
                cost: [C, C],
                damage: 70,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.setNumber = '134';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tranquill';
        this.fullName = 'Tranquill TEF';
    }
    reduceEffect(store, state, effect) {
        // Jet Wing
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
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
exports.Tranquill = Tranquill;
