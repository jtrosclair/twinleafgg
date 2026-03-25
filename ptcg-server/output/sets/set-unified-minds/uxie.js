"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uxie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Uxie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Secret Territory',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have Mesprit and Azelf in play, apply Weakness for each Pokémon (both yours and your opponent\'s) as \u00d74 instead.'
            }];
        this.attacks = [
            {
                name: 'Psyshot',
                cost: [C, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Uxie';
        this.fullName = 'Uxie UNM';
    }
    reduceEffect(store, state, effect) {
        // Ability: Secret Territory (passive - modify weakness to x4)
        // Ref: set-phantom-forces/pachirisu.ts (Trick Sticker - CheckPokemonStatsEffect weakness modification)
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            // Find if Uxie is in play and who owns it
            let uxieOwner = null;
            state.players.forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.getPokemonCard() === this) {
                        uxieOwner = p;
                    }
                });
            });
            if (!uxieOwner) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, uxieOwner, this)) {
                return state;
            }
            // Check if owner has Mesprit and Azelf in play
            let hasMesprit = false;
            let hasAzelf = false;
            uxieOwner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.name === 'Mesprit') {
                    hasMesprit = true;
                }
                if (pokemon && pokemon.name === 'Azelf') {
                    hasAzelf = true;
                }
            });
            if (!hasMesprit || !hasAzelf) {
                return state;
            }
            // Duplicate each weakness entry to make x2 become x4 (x2 * x2 = x4)
            const doubled = [...effect.weakness, ...effect.weakness.map(w => ({ type: w.type, value: w.value }))];
            effect.weakness = doubled;
        }
        return state;
    }
}
exports.Uxie = Uxie;
