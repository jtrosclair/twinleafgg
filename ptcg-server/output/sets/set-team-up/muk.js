"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Muk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Muk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grimer';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Stench',
                powerType: game_1.PowerType.ABILITY,
                text: 'The Special Condition Poisoned is not removed when your opponent\'s Pokémon evolve or devolve.'
            }];
        this.attacks = [{
                name: 'Toxic Secretion',
                cost: [P],
                damage: 40,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Muk';
        this.fullName = 'Muk TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckSpecialConditionRemovalEffect) {
            // Check if this Pokemon is in play
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!cardList) {
                return state;
            }
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const isInPlay = owner.active.cards.includes(this) || owner.bench.some(b => b.cards.includes(this));
            if (!isInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, this)) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, owner);
            // Check if the target Pokemon belongs to the opponent
            const isOpponentPokemon = opponent.active === effect.target ||
                opponent.bench.includes(effect.target);
            if (isOpponentPokemon && effect.target.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                if (!effect.preservedConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                    effect.preservedConditions.push(card_types_1.SpecialCondition.POISONED);
                }
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this, 20);
        }
        return state;
    }
}
exports.Muk = Muk;
