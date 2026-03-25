"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragoniteFB = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DragoniteFB extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Mach Blow',
                cost: [C, C, C],
                damage: 20,
                text: 'If the Defending Pokémon is a Pokémon SP, this attack\'s base damage is 80 instead of 20.'
            },
            {
                name: 'Giant Tail',
                cost: [C, C, C, C],
                damage: 100,
                text: 'Flip a coin. If tails, this attack does nothing.'
            },
        ];
        this.set = 'SV';
        this.name = 'Dragonite FB';
        this.fullName = 'Dragonite FB SV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if ((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_SP)) {
                effect.damage = 80;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.DragoniteFB = DragoniteFB;
