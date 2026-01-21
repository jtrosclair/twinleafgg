"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steelix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Steelix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Onix';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Tail Crush',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Flip a coin. If heads, this attack does 40 more damage.'
            }
        ];
        this.set = 'CES';
        this.setNumber = '89';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steelix';
        this.fullName = 'Steelix CES';
    }
    reduceEffect(store, state, effect) {
        // Tail Crush attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
            ], heads => {
                if (heads) {
                    effect.damage += 40;
                }
            });
        }
        return state;
    }
}
exports.Steelix = Steelix;
