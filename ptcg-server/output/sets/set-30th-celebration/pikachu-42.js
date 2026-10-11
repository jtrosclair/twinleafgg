"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu42 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #42 — Charge-Up Dash + Pika Bolt */
class Pikachu42 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Charge-Up Dash',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin until you get tails. Search your deck for an amount of Basic [L] Energy up to the number of heads and attach it to this Pokémon. Then, shuffle your deck.'
            }, {
                name: 'Pika Bolt',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 42';
    }
    reduceEffect(store, state, effect) {
        // Charge-Up Dash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, player, heads => {
                if (heads <= 0) {
                    return;
                }
                (0, prefabs_1.ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON)(store, state, player, heads, 1, {
                    destinationSlots: [game_1.SlotType.ACTIVE],
                    energyFilter: { energyType: game_1.EnergyType.BASIC, name: 'Lightning Energy' },
                    sameTarget: true,
                    min: 0,
                    allowCancel: false,
                });
            });
        }
        return state;
    }
}
exports.Pikachu42 = Pikachu42;
