"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vulpix = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vulpix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Vulpix';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.set = 'BS';
        this.fullName = 'Vulpix BS';
        this.cardType = card_types_1.CardType.FIRE;
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = ['Ninetales', 'Ninetales ex', 'Light Ninetales'];
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Confuse Ray',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Vulpix = Vulpix;
