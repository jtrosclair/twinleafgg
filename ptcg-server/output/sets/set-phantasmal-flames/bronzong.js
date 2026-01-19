"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzong = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_2 = require("../../game/store/card/card-types");
class Bronzong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = M;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Triple Draw',
                cost: [C],
                damage: 0,
                text: 'Draw 3 cards.'
            }, {
                name: 'Tool Drop',
                cost: [C, C, C],
                damage: 0,
                text: 'This attack does 40 damage for each Pokémon Tool attached to all Pokemon in play.'
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Bronzong';
        this.fullName = 'Bronzong M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 3);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let toolCount = 0;
            // Count tools on player's Pokemon
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.tools.forEach(card => {
                    if (card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_2.TrainerType.TOOL) {
                        toolCount++;
                    }
                });
            });
            // Count tools on opponent's Pokemon
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.tools.forEach(card => {
                    if (card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_2.TrainerType.TOOL) {
                        toolCount++;
                    }
                });
            });
            effect.damage = 40 * toolCount;
        }
        return state;
    }
}
exports.Bronzong = Bronzong;
