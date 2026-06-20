"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shuppet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const ghost_veil_1 = require("./ghost-veil");
class Shuppet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ghost Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon can\'t be affected by effects of attacks or Abilities from your opponent\'s Pokémon.',
            }];
        this.attacks = [{
                name: 'Hang Down',
                cost: [P],
                damage: 10,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '31';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shuppet';
        this.fullName = 'Shuppet M5';
    }
    reduceEffect(store, state, effect) {
        (0, ghost_veil_1.reduceGhostVeil)(store, state, effect, this);
        return state;
    }
}
exports.Shuppet = Shuppet;
