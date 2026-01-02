"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaknessGuard = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class WeaknessGuard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Weakness Guard';
        this.fullName = 'Weakness Guard AQ';
        this.text = 'Attach this card to 1 of your Pokémon. Discard it at the end of your opponent\'s next turn.\n\nAs long as this card is attached, this Pokémon has no Weakness.';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), transfers => {
                player.supporter.moveCardTo(effect.trainerCard, transfers[0]);
            });
        }
        // Discard at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const opponent = effect.player;
            const player = game_1.StateUtils.getOpponent(state, opponent);
            const cardList = game_1.StateUtils.findCardList(state, this);
            // Do nothing if the end turn effect is for this player (not opponent)
            if (effect.player === game_1.StateUtils.findOwner(state, cardList)) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        // Actual effect
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect && effect.target.tools.includes(this)) {
            const target = effect.target.getPokemonCard();
            if (target) {
                effect.weakness = [];
            }
        }
        return state;
    }
}
exports.WeaknessGuard = WeaknessGuard;
