"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const game_error_1 = require("../../game/game-error");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }, {
                name: 'Lost Mine',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'You can use this attack only if you have 10 or more cards in the Lost Zone. Put 12 damage counters on your opponent\'s Pokémon in any way you like.'
            }];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Sableye';
        this.fullName = 'Sableye LOR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.lostzone.cards.length <= 9) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_ATTACK);
            }
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(12, store, state, effect);
        }
        return state;
    }
}
exports.Sableye = Sableye;
