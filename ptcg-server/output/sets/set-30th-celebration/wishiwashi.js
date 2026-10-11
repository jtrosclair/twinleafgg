"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishiwashi = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wishiwashi extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 30;
        this.cardType = game_1.CardType.WATER;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Counterattack Grouping',
                powerType: game_1.PowerType.ABILITY,
                text: 'If your Wishiwashi or Wishiwashi ex is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if your Pokémon is Knocked Out), place 3 damage counters on the Attacking Pokémon.'
            }];
        this.attacks = [{
                name: 'Surprise Attack',
                cost: [game_1.CardType.WATER],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Wishiwashi';
        this.fullName = 'Wishiwashi 30C';
    }
    reduceEffect(store, state, effect) {
        // Counterattack Grouping
        if (effect instanceof attack_effects_1.AfterDamageEffect && state.phase === game_1.GamePhase.ATTACK) {
            const owner = game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this));
            if (!game_1.StateUtils.isPokemonInPlay(owner, this)) {
                return state;
            }
            if (effect.player === owner || effect.target !== owner.active) {
                return state;
            }
            const activeCard = owner.active.getPokemonCard();
            if (!activeCard || (activeCard.name !== 'Wishiwashi' && activeCard.name !== 'Wishiwashi ex')) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, this)) {
                return state;
            }
            const damageEffect = new game_effects_1.EffectOfAbilityEffect(owner, this.powers[0], this, effect.source);
            store.reduceEffect(state, damageEffect);
            if (damageEffect.target) {
                damageEffect.target.damage += 30;
            }
        }
        // Surprise Attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Wishiwashi = Wishiwashi;
