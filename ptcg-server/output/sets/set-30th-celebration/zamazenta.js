"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zamazenta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zamazenta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = card_types_1.CardType.METAL;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Knock Off',
                cost: [card_types_1.CardType.METAL],
                damage: 20,
                text: 'Before doing damage, discard a Pokémon Tool attached to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Shield Press',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'During your opponent\'s next turn, this Pokémon takes 50 less damage from attacks.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Zamazenta';
        this.fullName = 'Zamazenta 30C';
    }
    reduceEffect(store, state, effect) {
        // Knock Off
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const activePokemon = opponent.active;
            if (activePokemon.tools.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, activePokemon, opponent.discard, {
                    cards: [...activePokemon.tools],
                });
            }
        }
        // Shield Press
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.damageReductionNextTurn = 50;
        }
        return state;
    }
}
exports.Zamazenta = Zamazenta;
