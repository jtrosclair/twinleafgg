"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victini = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Victini extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'V Force',
                cost: [R, R],
                damage: 120,
                text: 'If you have less than 5 Benched Pokémon, this attack does nothing.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Victini';
        this.fullName = 'Victini SV11B';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            // Count number of benched Pokémon
            const benchedCount = player.bench.reduce((count, b) => count + (b.cards.length ? 1 : 0), 0);
            // If less than 5 benched Pokémon, attack does nothing
            if (benchedCount < 5) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Victini = Victini;
