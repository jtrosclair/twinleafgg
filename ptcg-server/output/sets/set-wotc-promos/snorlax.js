"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorlax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Snorlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Guard',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'As long as Snorlax is your Active Pokémon, the Defending Pokémon can\'t retreat. This power stops working when Snorlax is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Roll Over',
                cost: [C, C, C, C],
                damage: 30,
                text: 'Snorlax is now Asleep. Flip a coin. If heads, the Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'PR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Snorlax';
        this.fullName = 'Snorlax PR';
    }
    reduceEffect(store, state, effect) {
        // Block
        if (effect instanceof game_effects_1.RetreatEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSnorlaxInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (opponent.active.cards[0] == this) {
                    isSnorlaxInPlay = true;
                }
            });
            if (isSnorlaxInPlay) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                if (prefabs_1.IS_POKEMON_POWER_BLOCKED(store, state, opponent, this))
                    return state;
                if (opponent.active.cards[0] === this && opponent.active.specialConditions.length > 0) {
                    return state;
                }
                // Block the retreat action
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Roll Over
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result => {
                if (result) {
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
                }
            }));
        }
        return state;
    }
}
exports.Snorlax = Snorlax;
