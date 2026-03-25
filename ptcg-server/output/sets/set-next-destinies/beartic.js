"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beartic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Beartic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cubchoo';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Daunt',
                cost: [C, C],
                damage: 40,
                text: 'During your opponent\'s next turn, any damage done by attack from the Defending Pokémon is reduced by 20 (before applying Weakness and Resistance).'
            },
            {
                name: 'Ambush',
                cost: [W, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beartic';
        this.fullName = 'Beartic NXD';
        this.DAUNT_MARKER = 'DAUNT_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Daunt - add marker to defending Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.DAUNT_MARKER, opponent.active, this);
        }
        // Reduce damage from marked Pokémon
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const source = effect.source;
            if ((0, prefabs_1.HAS_MARKER)(this.DAUNT_MARKER, source, this)) {
                effect.damage = Math.max(0, effect.damage - 20);
            }
        }
        // Ambush - flip for extra damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    effect.damage += 30;
                }
            });
        }
        // Remove marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                (0, prefabs_1.REMOVE_MARKER)(this.DAUNT_MARKER, cardList, this);
            });
        }
        return state;
    }
}
exports.Beartic = Beartic;
