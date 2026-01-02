"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jellicentex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jellicentex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Frillish';
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: D }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Oceanic Curse',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Item cards  or attach any Pokémon Tool cards from their hand.'
            }];
        this.attacks = [{
                name: 'Power Press',
                cost: [P, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokémon has at least 2 extra Energy attached (in addition to this attack\'s cost), this attack does 80 more damage.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Jellicent ex';
        this.fullName = 'Jellicent ex SV11W';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
            state = store.reduceEffect(state, checkCost);
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Count total attached energy
            const totalEnergy = checkEnergy.energyMap.length;
            const attackCost = checkCost.cost.length;
            const extraEnergy = totalEnergy - attackCost;
            if (extraEnergy >= 2) {
                effect.damage += 80;
            }
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect || effect instanceof play_card_effects_1.AttachPokemonToolEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (opponent.active.getPokemonCard() === this) {
                if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, this)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
                }
            }
        }
        return state;
    }
}
exports.Jellicentex = Jellicentex;
