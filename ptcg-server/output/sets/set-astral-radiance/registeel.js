"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registeel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Registeel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Regi Gate',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Heavy Slam',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 220,
                damageCalculation: '-',
                text: 'This attack does 50 less damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.name = 'Registeel';
        this.fullName = 'Registeel ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActiveCard = opponent.active.getPokemonCard();
            if (opponentActiveCard) {
                const retreatCost = opponentActiveCard.retreat.filter(c => c === card_types_1.CardType.COLORLESS).length;
                effect.damage -= retreatCost * 50;
                if (effect.damage < 0) {
                    effect.damage = 0;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Registeel = Registeel;
