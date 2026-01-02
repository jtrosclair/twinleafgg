"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gyarados = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gyarados extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magikarp';
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Wreak Havoc',
                cost: [C],
                damage: 0,
                text: 'Flip a coin until you get tails. For each heads, discard the top 2 cards of your opponent\'s deck.'
            },
            {
                name: 'Wild Splash',
                cost: [W, W, C, C],
                damage: 230,
                text: 'Discard the top 5 cards of your deck.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Gyarados';
        this.fullName = 'Gyarados PGO';
    }
    reduceEffect(store, state, effect) {
        // Wreak Havoc
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    prefabs_1.MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: (heads * 2), sourceCard: this, sourceEffect: this.attacks[0] });
                    return state;
                });
            };
            return flipCoin();
        }
        // Raging Fin
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.MOVE_CARDS(store, state, player.deck, player.discard, { count: 5 });
        }
        return state;
    }
}
exports.Gyarados = Gyarados;
