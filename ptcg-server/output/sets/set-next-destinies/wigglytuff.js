"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wigglytuff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Wigglytuff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Jigglypuff';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Round',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the number of your Pokémon that have the Round attack.'
            },
            {
                name: 'Hypnoblast',
                cost: [C, C, C],
                damage: 60,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wigglytuff';
        this.fullName = 'Wigglytuff NXD';
    }
    reduceEffect(store, state, effect) {
        // Round
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let roundCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.attacks.some(attack => attack.name === 'Round')) {
                    roundCount++;
                }
            });
            effect.damage = 20 * roundCount;
        }
        // Hypnoblast
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Wigglytuff = Wigglytuff;
