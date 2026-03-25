"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pachirisu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pachirisu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 70;
        this.weakness = [{
                type: card_types_1.CardType.FIGHTING,
                value: 20
            }];
        this.resistance = [{
                type: card_types_1.CardType.METAL,
                value: -20
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Thunder Wave',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
            }, {
                name: 'Poison Berry',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'If you have Croagunk in play, this attack does 20 damage plus 20 ' +
                    'more damage and the Defending Pokemon is now Poisoned.'
            }];
        this.set = 'OP9';
        this.name = 'Pachirisu';
        this.fullName = 'Pachirisu OP9';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialCondition);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let isCroagunkInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Croagunk') {
                    isCroagunkInPlay = true;
                }
            });
            if (isCroagunkInPlay) {
                effect.damage += 20;
                const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
                store.reduceEffect(state, specialCondition);
            }
            return state;
        }
        return state;
    }
}
exports.Pachirisu = Pachirisu;
