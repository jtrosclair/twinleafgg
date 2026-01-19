"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scorbunny = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scorbunny extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Wild Kick',
                cost: [C],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scorbunny';
        this.fullName = 'Scorbunny M1L';
    }
    reduceEffect(store, state, effect) {
        // Wild Kick
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
                if (result === false) { // tails
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Scorbunny = Scorbunny;
