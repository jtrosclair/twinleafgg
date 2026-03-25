"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaldeanTauros = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PaldeanTauros extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: P }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Raging Charge',
                cost: [F],
                damage: 0,
                text: 'This attack does 40 damage for each damage counter on all of your Pokemon with "Tauros" in their name in play.',
            },
            {
                name: 'Double Edge',
                cost: [F, F],
                damage: 70,
                text: 'This Pokemon does 20 damage to itself.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Paldean Tauros';
        this.fullName = 'Paldean Tauros M2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let totalDamage = 0;
            // Count damage counters on all Pokemon with "Tauros" in their name
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card && card.name.includes('Tauros')) {
                    totalDamage += cardList.damage;
                }
            });
            // Set damage to 40x the total damage counters
            effect.damage = totalDamage * 40;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Deal 20 damage to this Pokemon
            const damageEffect = new attack_effects_1.DealDamageEffect(effect, 20);
            damageEffect.target = player.active;
            return store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.PaldeanTauros = PaldeanTauros;
