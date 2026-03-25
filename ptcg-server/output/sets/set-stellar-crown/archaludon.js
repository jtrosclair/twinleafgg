"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archaludon = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Archaludon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Duraludon';
        this.cardType = M;
        this.hp = 180;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Metal Bridge',
                powerType: game_1.PowerType.ABILITY,
                text: 'All of your Pokémon that have [M] Energy attached have no Retreat Cost.'
            }];
        this.attacks = [{
                name: 'Iron Blaster',
                cost: [M, M, C],
                damage: 160,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.setNumber = '107';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Archaludon';
        this.fullName = 'Archaludon SCR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            let inPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    inPlay = true;
                }
            });
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const activeHasMetalEnergy = checkProvidedEnergyEffect.energyMap.some(p => p.provides.includes(M));
            if (inPlay && activeHasMetalEnergy) {
                effect.cost = [];
            }
        }
        // Iron Blaster
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Archaludon = Archaludon;
