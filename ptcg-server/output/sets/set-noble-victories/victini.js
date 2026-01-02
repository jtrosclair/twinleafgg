"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Victini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'V-create',
                cost: [R, C],
                damage: 100,
                text: 'If you have 4 or fewer Benched Pokémon, this attack does nothing.'
            }];
        this.set = 'NVI';
        this.name = 'Victini';
        this.fullName = 'Victini NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (playerBench <= 4) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Victini = Victini;
