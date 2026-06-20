"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoutlandV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StoutlandV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Double Dip Fangs',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
            },
            {
                name: 'Wild Tackle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'This Pokémon also does 30 damage to itself.'
            }
        ];
        this.set = 'BST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.name = 'Stoutland V';
        this.fullName = 'Stoutland V BST';
        this.usedDoubleDipFangs = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedDoubleDipFangs = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedDoubleDipFangs = false;
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const knockedOutOwner = effect.player;
            const attacker = game_1.StateUtils.getOpponent(state, knockedOutOwner);
            if (!this.usedDoubleDipFangs) {
                return state;
            }
            // Do not activate between turns, or when it's not attacker's turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== attacker) {
                return state;
            }
            // Stoutland V wasn't attacking.
            if (attacker.active.getPokemonCard() !== this) {
                return state;
            }
            const knockedOutPokemon = knockedOutOwner.active.getPokemonCard();
            if ((knockedOutPokemon === null || knockedOutPokemon === void 0 ? void 0 : knockedOutPokemon.stage) === card_types_1.Stage.BASIC && effect.prizeCount > 0) {
                effect.prizeCount += 1;
            }
            this.usedDoubleDipFangs = false;
            return state;
        }
        return state;
    }
}
exports.StoutlandV = StoutlandV;
