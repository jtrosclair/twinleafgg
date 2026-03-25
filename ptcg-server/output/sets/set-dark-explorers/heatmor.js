"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heatmor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Heatmor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Hot Lick',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is Durant, this attack does 50 more damage.'
            },
            {
                name: 'Firebreathing',
                cost: [R, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Heatmor';
        this.fullName = 'Heatmor DEX';
    }
    reduceEffect(store, state, effect) {
        // Hot Lick
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingPokemon = opponent.active.getPokemonCard();
            if (defendingPokemon && defendingPokemon.name === 'Durant') {
                effect.damage += 50;
            }
        }
        // Firebreathing
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Heatmor = Heatmor;
