"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gigalith = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gigalith extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Boldore';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Revenge Cannon',
                cost: [F, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 more damage for each damage counter on each of your Benched Pokémon.'
            },
            {
                name: 'Reckless Charge',
                cost: [F, F, C, C],
                damage: 120,
                text: 'This Pokémon does 40 damage to itself.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gigalith';
        this.fullName = 'Gigalith DRX';
    }
    reduceEffect(store, state, effect) {
        // Revenge Cannon - 10 more damage for each damage counter on Benched Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let totalDamageCounters = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList === player.active) {
                    return;
                }
                totalDamageCounters += Math.floor(cardList.damage / 10);
            });
            effect.damage += 10 * totalDamageCounters;
        }
        // Reckless Charge - 40 damage to self
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 40);
        }
        return state;
    }
}
exports.Gigalith = Gigalith;
