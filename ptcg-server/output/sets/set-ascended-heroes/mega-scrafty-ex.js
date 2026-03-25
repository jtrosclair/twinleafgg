"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaScraftyex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaScraftyex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scraggy';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 330;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Counterattacking Crest',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), place 5 damage counters on the Attacking Pokémon.'
            }];
        this.attacks = [{
                name: 'Outlaw Leg',
                cost: [D, D, C],
                damage: 160,
                text: 'Discard a random card from your opponent\'s hand. Discard the top card of your opponent\'s deck.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.setNumber = '135';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Scrafty ex';
        this.fullName = 'Mega Scrafty ex M2a';
    }
    reduceEffect(store, state, effect) {
        // Counter Crest ability
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.getPokemonCard() === this && state.phase === state_1.GamePhase.ATTACK) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = effect.player;
            if (player === opponent || player.active !== effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, effect.source);
            store.reduceEffect(state, damageEffect);
            if (damageEffect.target) {
                damageEffect.target.damage += 50; // 5 damage counters = 50 damage
            }
        }
        // DDC Outlaw Leg attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard a random card from opponent's hand
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(randomCard, opponent.discard);
            }
            // Discard the top card of opponent's deck
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
        }
        return state;
    }
}
exports.MegaScraftyex = MegaScraftyex;
