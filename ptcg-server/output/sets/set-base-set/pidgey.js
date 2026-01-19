"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgey = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pidgey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Pidgey';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '57';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.fullName = 'Pidgey BS';
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = 'Pidgeotto';
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Whirlwind',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        return state;
    }
}
exports.Pidgey = Pidgey;
