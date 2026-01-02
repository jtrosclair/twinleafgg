"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vibrava = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vibrava extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trapinch';
        this.cardType = P;
        this.hp = 70;
        this.retreat = [C];
        this.attacks = [{
                name: 'Bite',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Sonic Noise',
                cost: [P, C],
                damage: 30,
                text: 'If the Defending Pokémon is Pokémon-ex, that Pokémon is now Confused.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Vibrava';
        this.fullName = 'Vibrava DF 42';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (prefabs_1.AFTER_ATTACK(effect, 1, this)) {
            if ((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
            }
        }
        return state;
    }
}
exports.Vibrava = Vibrava;
