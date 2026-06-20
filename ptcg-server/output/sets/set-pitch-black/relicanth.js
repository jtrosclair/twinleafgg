"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relicanth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Relicanth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Fossil Beatdown',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each of your Benched Pokémon with "Antique" in its name.',
            }];
        this.set = 'M5';
        this.setNumber = '16';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Relicanth';
        this.fullName = 'Relicanth M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let antiqueBench = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === player.active) {
                    return;
                }
                if (card.name.includes('Antique')) {
                    antiqueBench++;
                }
            });
            effect.damage += 30 * antiqueBench;
        }
        return state;
    }
}
exports.Relicanth = Relicanth;
