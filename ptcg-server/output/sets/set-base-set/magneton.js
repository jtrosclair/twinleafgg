"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magneton = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.fullName = 'Magneton BS';
        this.name = 'Magneton';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magnemite';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Thunder Wave',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Selfdestruct',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Does 20 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Magneton does 80 damage to itself.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Damage opponent's bench
            opponent.bench.forEach(benchPokemon => {
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 20);
                dealDamage.target = benchPokemon;
                store.reduceEffect(state, dealDamage);
            });
            // Damage player's bench
            player.bench.forEach(benchPokemon => {
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 20);
                dealDamage.target = benchPokemon;
                store.reduceEffect(state, dealDamage);
            });
            // Damage self
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 80);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Magneton = Magneton;
