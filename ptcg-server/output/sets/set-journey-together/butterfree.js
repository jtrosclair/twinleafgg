"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Butterfree = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Butterfree extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metapod';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Scale Hurricane',
                cost: [card_types_1.CardType.GRASS],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip 4 coins. This attack does 60 damage for each heads. If at least 2 of them are heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'JTG';
        this.name = 'Butterfree';
        this.fullName = 'Butterfree JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 60 * heads;
                if (heads >= 2) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Butterfree = Butterfree;
