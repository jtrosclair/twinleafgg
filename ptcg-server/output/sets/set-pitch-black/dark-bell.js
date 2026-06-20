"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkBell = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class DarkBell extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'M5';
        this.setNumber = '70';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Bell';
        this.fullName = 'Dark Bell M5';
        this.text = 'Both Active Pokémon (except any [D] Pokémon) are now Confused.';
    }
    reduceEffect(store, state, effect) {
        // Refs: set-crimson-invasion/nihilego-gx.ts (Empty Light - both Active Confused),
        //       set-chilling-reign/weeding-gloves.ts (CheckPokemonTypeEffect)
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const maybeConfuse = (targetPlayer, active) => {
                if (active.cards.length === 0) {
                    return;
                }
                const checkType = new check_effects_1.CheckPokemonTypeEffect(active);
                store.reduceEffect(state, checkType);
                if (!checkType.cardTypes.includes(card_types_1.CardType.DARK)) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, targetPlayer, this);
                }
            };
            maybeConfuse(player, player.active);
            maybeConfuse(opponent, opponent.active);
        }
        return state;
    }
}
exports.DarkBell = DarkBell;
