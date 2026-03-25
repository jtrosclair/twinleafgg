"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tympole = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Energy type constants (W, C, L) are assumed to be globally available as in other SV11B cards
class Tympole extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Round',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each of your Pokémon in play that has the Round attack.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Tympole';
        this.fullName = 'Tympole SV11B';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let pokemonCount = 0;
            player.bench.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard && c.attacks.some(a => a.name === 'Round')) {
                    pokemonCount += 1;
                }
            });
            if ((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.attacks.some(a => a.name === 'Round')) {
                pokemonCount += 1;
            }
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.Tympole = Tympole;
