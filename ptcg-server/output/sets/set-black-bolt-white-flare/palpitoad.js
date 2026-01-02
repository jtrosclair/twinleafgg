"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palpitoad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
// Energy type constants (W, C, L) are assumed to be globally available as in other SV11B cards
class Palpitoad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tympole';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Round',
                cost: [C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each of your Pokémon in play that has the Round attack.'
            },
            {
                name: 'Wave Splash',
                cost: [W, C, C],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Palpitoad';
        this.fullName = 'Palpitoad SV11B';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
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
            effect.damage = pokemonCount * 40;
        }
        return state;
    }
}
exports.Palpitoad = Palpitoad;
