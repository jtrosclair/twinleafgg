"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gumshoos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gumshoos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yungoos';
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Alert Headbutt',
                cost: [C, C],
                damage: 90,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon-GX or Pokémon-EX, this attack\'s base damage is 30.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '181';
        this.name = 'Gumshoos';
        this.fullName = 'Gumshoos UNM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive &&
                (opponentActive.tags.includes(card_types_1.CardTag.POKEMON_GX) ||
                    opponentActive.tags.includes(card_types_1.CardTag.POKEMON_EX))) {
                effect.damage = 30;
            }
        }
        return state;
    }
}
exports.Gumshoos = Gumshoos;
