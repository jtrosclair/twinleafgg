"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flareon = void 0;
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Flareon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Self-healing',
                useWhenInPlay: false,
                powerType: game_1.PowerType.POKEBODY,
                text: 'Whenever you attach a [R] Energy card from your hand to Flareon, remove all Special Conditions affecting Flareon.'
            }];
        this.attacks = [{
                name: 'Singe',
                cost: [R],
                damage: 0,
                text: 'The Defending Pokémon is now Burned.'
            },
            {
                name: 'Burn Booster',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Discard an Energy card attached to Flareon in order to use this attack. If the discarded card is a [R] Energy card, this attack does 40 damage plus 10 more damage.'
            }];
        this.set = 'SK';
        this.name = 'Flareon';
        this.fullName = 'Flareon SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (effect.energyCard.energyType === card_types_1.EnergyType.BASIC && effect.energyCard.provides.includes(card_types_1.CardType.FIRE)) {
                //remove special conditions
                const conditions = effect.target.specialConditions.slice();
                conditions.forEach(condition => {
                    effect.target.removeSpecialCondition(condition);
                });
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Make this acutally do the right thing later
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, card_types_1.CardType.FIRE);
            effect.damage += 10;
        }
        return state;
    }
}
exports.Flareon = Flareon;
