"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuFini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class TapuFini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Razor Fin',
                cost: [W],
                damage: 20,
                text: ''
            },
            {
                name: 'Nature Wave',
                cost: [W, W, C],
                damage: 100,
                text: 'If your opponent has any Ultra Beasts in play, this attack can be used for Colorless.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tapu Fini';
        this.fullName = 'Tapu Fini UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Nature Wave - reduce cost to [C] if opponent has Ultra Beasts
        // Ref: set-team-up/tentacruel.ts (Ultra Beast tag check)
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasUltraBeast = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.ULTRA_BEAST)) {
                    hasUltraBeast = true;
                }
            });
            if (hasUltraBeast) {
                effect.cost = [card_types_1.CardType.COLORLESS];
            }
        }
        return state;
    }
}
exports.TapuFini = TapuFini;
