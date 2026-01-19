"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanma = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yanma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = G;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'U-turn',
                cost: [C],
                damage: 10,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Cutting Wind',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'VIV';
        this.name = 'Yanma';
        this.fullName = 'Yanma VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
                }
            });
        }
        return state;
    }
}
exports.Yanma = Yanma;
