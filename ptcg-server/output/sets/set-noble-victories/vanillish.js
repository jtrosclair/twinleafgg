"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanillish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vanillish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vanillite';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ice Beam',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
            },
            {
                name: 'Frost Breath',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'NVI';
        this.name = 'Vanillish';
        this.fullName = 'Vanillish NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        return state;
    }
}
exports.Vanillish = Vanillish;
