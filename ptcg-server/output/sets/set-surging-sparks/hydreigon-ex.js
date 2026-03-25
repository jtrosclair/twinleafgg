"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigonex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hydreigonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.cardType = D;
        this.hp = 330;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Crashing Headbutt',
                cost: [D, C],
                damage: 200,
                text: 'Discard the top 3 cards of your opponent\'s deck.'
            },
            {
                name: 'Obsidian',
                cost: [P, D, M, C],
                damage: 130,
                text: 'This attack also does 130 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '119';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hydreigon ex';
        this.fullName = 'Hydreigon ex SSP';
    }
    reduceEffect(store, state, effect) {
        // Tera
        (0, prefabs_1.TERA_RULE)(effect, state, this);
        // Crashing Headbutt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DISCARD_TOP_X_OF_OPPONENTS_DECK)(store, state, effect.player, 3, this, this.attacks[0]);
        }
        // Obsidian
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(130, effect, store, state, 2, 2);
        }
        return state;
    }
}
exports.Hydreigonex = Hydreigonex;
