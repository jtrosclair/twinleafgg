"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carvanha = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Carvanha extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Agility',
                cost: [D],
                damage: 10,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokemon during your opponent\'s next turn.'
            }];
        this.set = 'CEC';
        this.name = 'Carvanha';
        this.fullName = 'Carvanha CEC';
        this.setNumber = '132';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    if (effect instanceof attack_effects_1.PutDamageEffect) {
                        effect.preventDefault = true;
                    }
                    if (effect instanceof attack_effects_1.AbstractAttackEffect) {
                        effect.preventDefault = true;
                    }
                }
            });
        }
        return state;
    }
}
exports.Carvanha = Carvanha;
