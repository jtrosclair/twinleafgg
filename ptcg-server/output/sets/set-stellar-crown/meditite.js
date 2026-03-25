"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meditite = void 0;
/* eslint-disable indent */
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meditite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.retreat = [C];
        this.weakness = [{ type: P }];
        this.attacks = [
            {
                name: 'Calm Mind',
                cost: [C],
                damage: 0,
                text: 'Heal 20 damage from this Pokémon.'
            },
            {
                name: 'Chop',
                cost: [F, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Meditite';
        this.fullName = 'Meditite SCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, effect.player.active, 20);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Meditite = Meditite;
