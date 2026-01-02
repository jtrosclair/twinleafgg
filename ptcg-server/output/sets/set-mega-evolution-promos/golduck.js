"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golduck = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Golduck extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Psyduck';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Damp',
                powerType: game_1.PowerType.ABILITY,
                text: 'Pokémon in play (both yours and your opponent\'s) lose any Ability that requires the Pokémon using it to Knock Out itself.'
            }];
        this.attacks = [{
                name: 'Hydro Pump',
                cost: [C, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each [W] Energy attached to this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'MEP';
        this.setNumber = '8';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Golduck';
        this.fullName = 'Golduck MEP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.ABILITY && effect.power.name !== 'Damp') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isGolduckInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isGolduckInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isGolduckInPlay = true;
                }
            });
            if (!isGolduckInPlay) {
                return state;
            }
            if (!effect.power.knocksOutSelf) {
                return state;
            }
            // Try reducing ability for each player  
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.WATER;
                }).length;
            });
            effect.damage += energyCount * 20;
        }
        return state;
    }
}
exports.Golduck = Golduck;
