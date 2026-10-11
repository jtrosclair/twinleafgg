"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Igglybuff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Igglybuff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 30;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [];
        this.attacks = [{
                name: 'Bouncy Circle',
                cost: [],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each of your Benched Pokémon that has a maximum HP of 30.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Igglybuff';
        this.fullName = 'Igglybuff 30C';
    }
    reduceEffect(store, state, effect) {
        // Bouncy Circle
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let count = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, pokemon) => {
                if (cardList === player.active) {
                    return;
                }
                if (pokemon.hp === 30) {
                    count += 1;
                }
            });
            effect.damage = 30 * count;
        }
        return state;
    }
}
exports.Igglybuff = Igglybuff;
