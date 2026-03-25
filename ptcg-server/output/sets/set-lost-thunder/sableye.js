"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.retreat = [C];
        this.attacks = [{
                name: 'Quick Hunt',
                cost: [C],
                damage: 0,
                canUseOnFirstTurn: true,
                text: 'If you go first, you can use this attack on your first turn. Search your deck for a card and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Cursed Drop',
                cost: [P],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like.'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Sableye';
        this.fullName = 'Sableye LOT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, {}, { min: 1, max: 1, allowCancel: false }, this.attacks[0]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(3, store, state, effect, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH]);
        }
        return state;
    }
}
exports.Sableye = Sableye;
