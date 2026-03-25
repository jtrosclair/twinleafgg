"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miraidonex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Miraidonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.cardType = L;
        this.hp = 220;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Slashing Claw',
                cost: [L],
                damage: 40,
                text: ''
            },
            {
                name: 'Hadron Spark',
                cost: [L, L, C],
                damage: 120,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 120 more damage.'
            }];
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Miraidon ex';
        this.fullName = 'Miraidon ex ASC';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if ((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                effect.damage += 20;
            }
        }
        (0, prefabs_1.TERA_RULE)(effect, state, this);
        return state;
    }
}
exports.Miraidonex = Miraidonex;
