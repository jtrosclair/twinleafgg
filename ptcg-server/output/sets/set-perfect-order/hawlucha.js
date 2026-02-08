"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hawlucha = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hawlucha extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Revenge Kick',
                cost: [F],
                damage: 30,
                text: 'If your Benched Pokemon have any damage counters on them, this attack does 60 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Hawlucha';
        this.fullName = 'Hawlucha M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if any Benched Pokemon have damage
            let hasDamagedBench = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList !== player.active && cardList.damage > 0) {
                    hasDamagedBench = true;
                }
            });
            if (hasDamagedBench) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.Hawlucha = Hawlucha;
