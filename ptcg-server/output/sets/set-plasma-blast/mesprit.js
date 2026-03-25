"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesprit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Mesprit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Mental Shroud',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have Uxie and Azelf in play, each of your Pokémon has no Weakness.'
            }];
        this.attacks = [
            {
                name: 'Psyshot',
                cost: [P, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mesprit';
        this.fullName = 'Mesprit PLB';
    }
    reduceEffect(store, state, effect) {
        // Ability: Mental Shroud - passive, intercept CheckPokemonStatsEffect
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            // Find who owns this Mesprit and if it's in play
            let mespritOwner = null;
            state.players.forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.getPokemonCard() === this) {
                        mespritOwner = p;
                    }
                });
            });
            if (!mespritOwner) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, mespritOwner, this)) {
                return state;
            }
            // Check if the target Pokemon belongs to the same player
            let targetOwner = null;
            state.players.forEach(p => {
                if (p.active === effect.target || p.bench.includes(effect.target)) {
                    targetOwner = p;
                }
            });
            if (targetOwner !== mespritOwner) {
                return state;
            }
            // Check if Uxie and Azelf are in play on our side
            let hasUxie = false;
            let hasAzelf = false;
            mespritOwner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.name === 'Uxie') {
                    hasUxie = true;
                }
                if (pokemon && pokemon.name === 'Azelf') {
                    hasAzelf = true;
                }
            });
            if (hasUxie && hasAzelf) {
                effect.weakness = [];
            }
        }
        return state;
    }
}
exports.Mesprit = Mesprit;
