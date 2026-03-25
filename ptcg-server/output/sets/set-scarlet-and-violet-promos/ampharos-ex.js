"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ampharosex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Ampharosex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Flaaffy';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Electro Ball',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 60,
                text: ''
            },
            {
                name: 'Thunderstrike Tail',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 140,
                damageCalculation: '+',
                text: 'You may discard 2 Energy from this Pokémon to have this attack do 100 more damage.'
            }
        ];
        this.set = 'SVP';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Ampharos ex';
        this.fullName = 'Ampharos ex SVP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
                    effect.damage += 100;
                }
            }, __1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
        }
        return state;
    }
}
exports.Ampharosex = Ampharosex;
