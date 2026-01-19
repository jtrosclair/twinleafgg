"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagearnaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MagearnaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 210;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gear Throw',
                cost: [M],
                damage: 0,
                text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Special Laser',
                cost: [M, M, C],
                damage: 100,
                text: 'If this Pokémon has any Special Energy attached, this attack does 120 more damage.'
            }];
        this.set = 'SIT';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.name = 'Magearna V';
        this.fullName = 'Magearna V SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(30, effect, store, state);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            const hasSpecialEnergy = checkEnergy.energyMap.some(em => {
                const energyCard = em.card;
                return energyCard instanceof game_1.EnergyCard && energyCard.energyType === card_types_1.EnergyType.SPECIAL;
            });
            if (hasSpecialEnergy) {
                effect.damage += 120;
            }
        }
        return state;
    }
}
exports.MagearnaV = MagearnaV;
