"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oranguru = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Oranguru extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Sage\'s Riddle',
                cost: [C],
                damage: 0,
                text: 'Put a Pokémon from your hand face down in front of you. Your opponent guesses the type of that Pokémon, and then you reveal it. If your opponent guessed right, they draw 4 cards. If they guessed wrong, you draw 4 cards. Return the Pokémon to your hand.'
            },
            {
                name: 'Gentle Slap',
                cost: [C, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '182';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Oranguru';
        this.fullName = 'Oranguru UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Sage's Riddle
        // TODO: Guessing mechanic (opponent guesses Pokemon type) not supported by engine.
        // Simplified: Player always draws 4 cards.
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 4);
        }
        return state;
    }
}
exports.Oranguru = Oranguru;
