"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accelgor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Accelgor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shelmet';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [];
        this.attacks = [{
                name: 'Hammer In',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: ''
            }, {
                name: 'Deck and Cover',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'The Defending Pokemon is now Paralyzed and Poisoned. Shuffle this ' +
                    'Pokemon and all cards attached to it into your deck.'
            }];
        this.set = 'DEX';
        this.name = 'Accelgor';
        this.fullName = 'Accelgor DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 1, this)) {
            const player = effect.player;
            player.active.moveTo(player.deck);
            player.active.clearEffects();
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, state_utils_1.StateUtils.getOpponent(state, player), this);
            prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, state_utils_1.StateUtils.getOpponent(state, player), this);
            return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Accelgor = Accelgor;
