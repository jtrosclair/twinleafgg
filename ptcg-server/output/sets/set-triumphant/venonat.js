"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venonat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Venonat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Leech Life',
                cost: [G],
                damage: 10,
                text: 'Remove from Venonat the number of damage counters equal to the damage you did to the Defending Pokémon.'
            },
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Venonat';
        this.fullName = 'Venonat TM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, player.active, effect.damage);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Venonat = Venonat;
