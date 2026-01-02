"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanmega = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yanmega extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yanma';
        this.hp = 130;
        this.cardType = G;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'U-turn',
                cost: [C, C],
                damage: 50,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Cutting Wind',
                cost: [C, C, C, C],
                damage: 130,
                text: ''
            }
        ];
        this.set = 'VIV';
        this.name = 'Yanmega';
        this.fullName = 'Yanmega VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
                }
            });
        }
        return state;
    }
}
exports.Yanmega = Yanmega;
