"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoroark = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zoroark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zorua';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Brutal Bash',
                cost: [C, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'Does 20 damage times the number of [D] Pokémon you have in play.'
            },
            {
                name: 'Dark Rush',
                cost: [D, D],
                damage: 0,
                damageCalculation: 'x',
                text: 'Does 20 damage times the number of damage counters on this Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.name = 'Zoroark';
        this.fullName = 'Zoroark DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
    }
    reduceEffect(store, state, effect) {
        // Brutal Bash - damage based on Dark Pokémon in play
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let darkPokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.cardType === card_types_1.CardType.DARK) {
                    darkPokemonCount++;
                }
            });
            effect.damage = 20 * darkPokemonCount;
        }
        // Dark Rush - damage based on damage counters on this Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Damage counters = damage / 10
            const damageCounters = player.active.damage / 10;
            effect.damage = 20 * damageCounters;
        }
        return state;
    }
}
exports.Zoroark = Zoroark;
