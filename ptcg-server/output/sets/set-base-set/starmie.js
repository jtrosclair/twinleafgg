"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Starmie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Starmie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Starmie';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '64';
        this.cardType = card_types_1.CardType.WATER;
        this.fullName = 'Starmie';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Staryu';
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Recover',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                text: 'Discard 1 [W] Energy card attached to Starmie in order to use this attack. Remove all damage counters from Starmie.',
                damage: 0
            },
            {
                name: 'Star Freeze',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, W);
            const player = effect.player;
            const heal = new game_effects_1.HealEffect(player, player.active, player.active.damage);
            heal.target = effect.player.active;
            store.reduceEffect(state, heal);
        }
        if (prefabs_1.AFTER_ATTACK(effect, 1, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Starmie = Starmie;
