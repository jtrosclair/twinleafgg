"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seismitoad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Energy type constants (W, C, L) are assumed to be globally available as in other SV11B cards
class Seismitoad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Palpitoad';
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Round',
                cost: [C, C, C],
                damage: 70,
                damageCalculation: 'x',
                text: 'This attack does 70 damage for each of your Pokémon in play that has the Round attack.'
            },
            {
                name: 'Hyper Voice',
                cost: [W, C, C, C],
                damage: 160,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Seismitoad';
        this.fullName = 'Seismitoad SV11B';
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
            effect.damage = pokemonCount * 70;
        }
        return state;
    }
}
exports.Seismitoad = Seismitoad;
