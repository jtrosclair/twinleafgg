"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkFeraligatr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkFeraligatr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dark Croconaw';
        this.tags = [card_types_1.CardTag.DARK];
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Scare',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'As long as Dark Feraligatr is your Active Pokémon, all of your opponent\'s Baby Pokémon Powers stop working and your opponent\'s Baby Pokémon can\'t attack. This power stops working while Dark Feraligatr is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Crushing Blow',
                cost: [W, W, W],
                damage: 50,
                text: 'If the Defending Pokémon has any Energy cards attached to it, flip a coin. If heads, choose 1 of those cards and discard it.'
            }];
        this.set = 'N4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Dark Feraligatr';
        this.fullName = 'Dark Feraligatr N4';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Baby Rule effect blocking
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.BABY_RULE) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // is not active Pokemon
            if (opponent.active.getPokemonCard() !== this) {
                return state;
            }
            // is affected by a special condition
            if (opponent.active.getPokemonCard() === this &&
                (opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                    opponent.active.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                    opponent.active.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED))) {
                return state;
            }
            if (prefabs_1.IS_POKEMON_POWER_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Babies can not attack
        if (effect instanceof game_effects_1.AttackEffect && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.BABY))) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (prefabs_1.IS_POKEMON_POWER_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            if (opponent.active.getPokemonCard() === this &&
                opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                opponent.active.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                opponent.active.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            if (effect.opponent.active.getPokemonCard() === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                return state; // No energy to discard
            }
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }), selected => {
                        const card = selected[0];
                        if (!card) {
                            return;
                        }
                        opponent.active.moveCardTo(card, opponent.discard);
                    });
                }
            });
        }
        return state;
    }
}
exports.DarkFeraligatr = DarkFeraligatr;
