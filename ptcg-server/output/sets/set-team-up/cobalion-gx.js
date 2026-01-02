"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CobalionGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class CobalionGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = M;
        this.hp = 170;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Metal Symbol',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Pokémon that has any [M] Energy attached to it can\'t be affected by any Special Conditions. (Remove any Special Conditions affecting those Pokémon.)'
            }];
        this.attacks = [
            {
                name: 'Dueling Saber',
                cost: [M, M],
                damage: 50,
                damageCalculation: '+',
                text: 'If there is any Stadium card in play, this attack does 60 more damage.'
            },
            {
                name: 'Iron Rule-GX',
                cost: [C],
                damage: 0,
                text: 'During your opponent\'s next turn, their Pokémon can\'t attack. (This includes Pokémon that come into play on that turn.) (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'TEU';
        this.setNumber = '106';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cobalion-GX';
        this.fullName = 'Cobalion-GX TEU';
        this.IRON_RULE_MARKER = 'IRON_RULE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                if (player.active.specialConditions.length === 0 || prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                    return;
                }
                let hasCobalionInPlay = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        hasCobalionInPlay = true;
                    }
                });
                if (!hasCobalionInPlay) {
                    return state;
                }
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                const energyMap = checkProvidedEnergyEffect.energyMap;
                const hasMetalEnergy = game_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.METAL]);
                if (hasMetalEnergy) {
                    const conditions = player.active.specialConditions.slice();
                    conditions.forEach(condition => {
                        player.active.removeSpecialCondition(condition);
                    });
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (game_1.StateUtils.getStadiumCard(state) !== undefined) {
                prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 60);
            }
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            prefabs_1.ADD_MARKER(this.IRON_RULE_MARKER, opponent, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && prefabs_1.HAS_MARKER(this.IRON_RULE_MARKER, effect.player, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.IRON_RULE_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.IRON_RULE_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.CobalionGX = CobalionGX;
