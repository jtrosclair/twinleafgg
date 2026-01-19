"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarchompC = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GarchompC extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: C }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Claw Swipe',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Earthquake',
                cost: [C, C, C],
                damage: 50,
                text: 'This attack does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'SV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Garchomp C';
        this.fullName = 'Garchomp C SV';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== player.active) {
                    const damage = new attack_effects_1.PutDamageEffect(effect, 10);
                    damage.target = card;
                    store.reduceEffect(state, damage);
                }
            });
        }
        return state;
    }
}
exports.GarchompC = GarchompC;
