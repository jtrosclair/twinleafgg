"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golisopod = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Golisopod extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.evolvesFrom = 'Wimpod';
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Emergency Exit',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has 2 or fewer Energy attached to it, it has no Retreat Cost.',
                useWhenInPlay: false
            }];
        this.attacks = [{
                name: 'First Impression',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                damageCalculation: '+',
                text: 'If this Pokémon was on the Bench and became your Active Pokémon this turn, this attack does 60 more damage.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Golisopod';
        this.fullName = 'Golisopod UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.length;
            });
            if (energyCount <= 2) {
                effect.cost = [];
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if ((0, prefabs_1.MOVED_TO_ACTIVE_THIS_TURN)(effect.player, this)) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.Golisopod = Golisopod;
