"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joltik = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Joltik extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Surprise Attack',
                cost: [L],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.name = 'Joltik';
        this.fullName = 'Joltik SV11W';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Joltik = Joltik;
