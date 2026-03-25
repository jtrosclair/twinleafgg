"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simipour = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Simipour extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Panpour';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Collect',
                cost: [W],
                damage: 0,
                text: 'Draw 3 cards.'
            },
            {
                name: 'Stadium Wave',
                cost: [W, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If there is any Stadium card in play, this attack does 30 more damage and the Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Simipour';
        this.fullName = 'Simipour NXD';
    }
    reduceEffect(store, state, effect) {
        // Collect - draw 3 cards
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 3);
        }
        // Stadium Wave - bonus damage and sleep if stadium in play
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Check if there's a stadium in play
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage += 30;
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Simipour = Simipour;
