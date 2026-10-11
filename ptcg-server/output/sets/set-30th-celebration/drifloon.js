"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drifloon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Drifloon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Float Up',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 20,
                text: 'You may shuffle this Pokémon and all attached cards into your deck.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Drifloon';
        this.fullName = 'Drifloon 30C';
    }
    reduceEffect(store, state, effect) {
        // Float Up
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK)(store, state, effect);
                }
            }, game_1.GameMessage.WANT_TO_SHUFFLE_POKEMON_INTO_DECK);
        }
        return state;
    }
}
exports.Drifloon = Drifloon;
