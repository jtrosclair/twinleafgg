"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mimikyu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Perplex',
                cost: [P],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Worst Gift',
                cost: [P, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage for each damage counter on all of your opponent\'s Pokémon.'
            }];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Mimikyu';
        this.fullName = 'Mimikyu LOR';
        this.regulationMark = 'F';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            let damage = 0;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                damage += cardList.damage;
            });
            effect.damage = damage;
        }
        return state;
    }
}
exports.Mimikyu = Mimikyu;
