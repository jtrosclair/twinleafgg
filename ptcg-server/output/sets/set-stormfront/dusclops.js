"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusclops = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dusclops extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Duskull';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D, value: +20 }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Confuse Ray',
                cost: [P, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            },
            {
                name: 'Trick Room',
                cost: [P, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'If you have a Stadium card in play, this attack does 40 damage plus 20 more damage. If your opponent has a Stadium card in play, remove 2 damage counters from Dusclops.'
            }];
        this.set = 'SF';
        this.name = 'Dusclops';
        this.fullName = 'Dusclops SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard === undefined) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
            const stadiumOwner = game_1.StateUtils.findOwner(state, cardList);
            if (stadiumOwner === effect.player) {
                effect.damage += 20;
            }
            else {
                prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
            }
        }
        return state;
    }
}
exports.Dusclops = Dusclops;
