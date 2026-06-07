"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spewpa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Spewpa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scatterbug';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Hide',
                cost: [G],
                damage: 0,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage and effects from attacks done to this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.usSetNumber = 'POR 8';
        this.name = 'Spewpa';
        this.fullName = 'Spewpa M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
                if (result) {
                    (0, prefabs_1.PREVENT_DAMAGE)(store, state, effect, this);
                }
            });
        }
        return state;
    }
}
exports.Spewpa = Spewpa;
