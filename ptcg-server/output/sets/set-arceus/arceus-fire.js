"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusFire = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArceusFire extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.tags = [card_types_1.CardTag.ARCEUS];
        this.powers = [{
                name: 'Arceus Rule',
                powerType: game_1.PowerType.ARCEUS_RULE,
                text: 'You may have as many of this card in your deck as you like.'
            }];
        this.attacks = [
            {
                name: 'Bright FLame',
                cost: [R, C, C],
                damage: 80,
                text: 'Flip a coin. If tails, discard 2 Energy attached to Arceus.'
            }
        ];
        this.set = 'AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'AR3';
        this.name = 'Arceus';
        this.fullName = 'Arceus Fire AR';
    }
    reduceEffect(store, state, effect) {
        // Bright Flame
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
                }
            });
        }
        return state;
    }
}
exports.ArceusFire = ArceusFire;
