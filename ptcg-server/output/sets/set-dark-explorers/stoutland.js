"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stoutland = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const card_types_2 = require("../../game/store/card/card-types");
class Stoutland extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Herdier';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Special Fang',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'If this Pokémon has a Special Energy attached to it, this attack does 40 more damage.'
            },
            {
                name: 'Ferocious Bellow',
                cost: [C, C, C, C],
                damage: 60,
                text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 30 (before applying Weakness and Resistance).'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '88';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Stoutland';
        this.fullName = 'Stoutland DEX';
        this.FEROCIOUS_BELLOW_MARKER = 'FEROCIOUS_BELLOW_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Special Fang - +40 if any Special Energy attached
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkEnergy);
            const hasSpecialEnergy = checkEnergy.energyMap.some(em => em.card.energyType === card_types_2.EnergyType.SPECIAL);
            if (hasSpecialEnergy) {
                effect.damage += 40;
            }
        }
        // Ferocious Bellow - add marker to defending Pokémon for damage reduction
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.ADD_MARKER)(this.FEROCIOUS_BELLOW_MARKER, opponent.active, this);
        }
        // Reduce damage from Pokémon with Ferocious Bellow marker
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const source = effect.source;
            if ((0, prefabs_1.HAS_MARKER)(this.FEROCIOUS_BELLOW_MARKER, source, this)) {
                effect.damage = Math.max(0, effect.damage - 30);
            }
        }
        // Remove marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            // Remove marker from current player's Pokémon (it's now their turn ending)
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                (0, prefabs_1.REMOVE_MARKER)(this.FEROCIOUS_BELLOW_MARKER, cardList, this);
            });
        }
        return state;
    }
}
exports.Stoutland = Stoutland;
