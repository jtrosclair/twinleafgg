"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlusPower = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class PlusPower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'PlusPower';
        this.fullName = 'PlusPower DP';
        this.text = 'Attach PlusPower to 1 of your Pokémon. Discard this card at the end of your turn.\n\nIf the Pokémon PlusPower is attached to attacks, the attack does 10 more damage to the Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), transfers => {
                player.supporter.moveCardTo(effect.trainerCard, transfers[0]);
            });
        }
        // Discard at end of your's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        // Actual effect
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            // must deal > 0 damage to active Pokémon
            if (effect.damage && effect.damage > 0 && (effect.target === effect.opponent.active || effect.target === effect.player.active)) {
                effect.damage += 10;
            }
        }
        return state;
    }
}
exports.PlusPower = PlusPower;
