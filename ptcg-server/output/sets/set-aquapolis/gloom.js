"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gloom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gloom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oddish';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Enervating Pollen',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Gloom is in play, Resistance on each player\'s Active Pokémon only reduces damage by 10.'
            }];
        this.attacks = [{
                name: 'Sleep Sap',
                cost: [C, C],
                damage: 20,
                text: 'Both the Defending Pokémon and Gloom are now Asleep (after doing damage).'
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Gloom';
        this.fullName = 'Gloom AQ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Gloom is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const target = effect.target.getPokemonCard();
            if (target && Array.isArray(target.resistance)) {
                // Set each resistance value to -10
                effect.resistance = target.resistance.map(res => {
                    if (typeof res.value === 'number') {
                        return Object.assign(Object.assign({}, res), { value: -10 });
                    }
                    return res;
                });
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Gloom = Gloom;
