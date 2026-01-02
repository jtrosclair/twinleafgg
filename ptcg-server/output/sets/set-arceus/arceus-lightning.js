"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusLightning = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArceusLightning extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.tags = [card_types_1.CardTag.ARCEUS];
        this.powers = [{
                name: 'Arceus Rule',
                powerType: game_1.PowerType.ARCEUS_RULE,
                text: 'You may have as many of this card in your deck as you like.'
            }];
        this.attacks = [
            {
                name: 'Lightning Turn',
                cost: [L, C],
                damage: 30,
                text: 'Switch Arceus with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'AR6';
        this.name = 'Arceus';
        this.fullName = 'Arceus Lightning AR';
    }
    reduceEffect(store, state, effect) {
        // Lightning Turn
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
        }
        return state;
    }
}
exports.ArceusLightning = ArceusLightning;
