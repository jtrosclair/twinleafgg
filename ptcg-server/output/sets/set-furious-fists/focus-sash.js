"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusSash = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FocusSash extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Focus Sash';
        this.fullName = 'Focus Sash FFI';
        this.text = 'If the [F] Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.tools.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, player, this) ||
                !(0, prefabs_1.DAMAGED_FROM_FULL_HP)(store, state, effect, player, effect.target)) {
                return state;
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            state = store.reduceEffect(state, checkPokemonTypeEffect);
            if (!checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                return state;
            }
            effect.surviveOnTenHPReason = this.name;
            store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_TOOL, { card: this.name });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.tools && cardList.tools.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        return state;
    }
}
exports.FocusSash = FocusSash;
