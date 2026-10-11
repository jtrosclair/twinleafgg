"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NidoranFemale = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const effect_of_attack_prefabs_1 = require("../../game/store/prefabs/effect-of-attack-prefabs");
class NidoranFemale extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Growl',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'During your opponent\'s next turn, attacks used by the Defending Pokémon do 30 less damage (before applying Weakness and Resistance.)'
            },
            {
                name: 'Headbutt',
                cost: [card_types_1.CardType.DARK],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Nidoran ♀';
        this.fullName = 'Nidoran ♀ 30C';
    }
    reduceEffect(store, state, effect) {
        // Growl
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, effect_of_attack_prefabs_1.DEFENDING_POKEMON_DOES_LESS_DAMAGE)(store, state, effect, this, 30);
        }
        return state;
    }
}
exports.NidoranFemale = NidoranFemale;
