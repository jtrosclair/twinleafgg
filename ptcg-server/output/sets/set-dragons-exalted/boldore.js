"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boldore = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Boldore extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Roggenrola';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Rock Cannon',
                cost: [F],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Earthquake',
                cost: [F, C, C],
                damage: 60,
                text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '66';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Boldore';
        this.fullName = 'Boldore DRX';
    }
    reduceEffect(store, state, effect) {
        // Rock Cannon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, attack_effects_2.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS)(store, state, effect, 30);
        }
        // Earthquake - 10 damage to each of your own Benched Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList === player.active) {
                    return;
                }
                const damage = new attack_effects_1.PutDamageEffect(effect, 10);
                damage.target = cardList;
                store.reduceEffect(state, damage);
            });
        }
        return state;
    }
}
exports.Boldore = Boldore;
