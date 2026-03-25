"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lokix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lokix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Nymble';
        this.attacks = [{
                name: 'Assaulting Kick',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                damageCalculation: '+',
                text: ' If this Pokémon evolved from Nymble during this turn, this attack does 100 more damage. '
            },
            {
                name: 'Speed Attack',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Lokix PAL';
        this.name = 'Lokix';
        this.setNumber = '21';
        this.evolvedFromNymble = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList instanceof game_1.PokemonCardList) {
                if (cardList.pokemonPlayedTurn === state.turn) {
                    effect.damage += 100;
                }
            }
        }
        return state;
    }
}
exports.Lokix = Lokix;
