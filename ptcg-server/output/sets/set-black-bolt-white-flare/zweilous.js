"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zweilous = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zweilous extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Deino';
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Double Hit',
                cost: [C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 40 damage for each heads.'
            },
            {
                name: 'Pitch-Black Fangs',
                cost: [D, D, C, C],
                damage: 100,
                text: ''
            }];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Zweilous';
        this.fullName = 'Zweilous SV11W';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Zweilous = Zweilous;
