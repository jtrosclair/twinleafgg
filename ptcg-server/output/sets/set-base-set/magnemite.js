"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnemite = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magnemite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = L;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Thunder Wave',
                cost: [L],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Selfdestruct',
                cost: [L, C],
                damage: 40,
                text: 'Does 10 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Magnemite does 40 damage to itself.'
            }
        ];
        this.set = 'BS';
        this.fullName = 'Magnemite BS';
        this.name = 'Magnemite';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Damage opponent's bench
            opponent.bench.forEach(benchPokemon => {
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                dealDamage.target = benchPokemon;
                store.reduceEffect(state, dealDamage);
            });
            // Damage player's bench
            player.bench.forEach(benchPokemon => {
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                dealDamage.target = benchPokemon;
                store.reduceEffect(state, dealDamage);
            });
            // Damage self
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 40);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Magnemite = Magnemite;
