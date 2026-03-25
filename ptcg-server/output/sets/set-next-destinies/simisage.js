"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simisage = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Simisage extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pansage';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Collect',
                cost: [G],
                damage: 0,
                text: 'Draw 3 cards.'
            },
            {
                name: 'Stadium Drain',
                cost: [G, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If there is any Stadium card in play, this attack does 30 more damage and heal 30 damage from this Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Simisage';
        this.fullName = 'Simisage NXD';
    }
    reduceEffect(store, state, effect) {
        // Collect - draw 3 cards
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 3);
        }
        // Stadium Drain - bonus damage and heal if stadium in play
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Check if there's a stadium in play
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage += 30;
                (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
            }
        }
        return state;
    }
}
exports.Simisage = Simisage;
