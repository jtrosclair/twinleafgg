"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LisiasAppeal = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LisiasAppeal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '179';
        this.name = 'Lisia\'s Appeal';
        this.fullName = 'Lisia\'s Appeal SSP';
        this.text = 'Switch in 1 of your opponent\'s Benched Basic Pokémon to the Active Spot. The new Active Pokémon is now Confused.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (target.slot !== game_1.SlotType.BENCH) {
                    return;
                }
                if (card === undefined || card.stage !== card_types_1.Stage.BASIC) {
                    blocked.push(target);
                }
            });
            // Legacy implementation:
            // - Used a manual ChoosePokemonPrompt with non-Basic opponent Bench blocked.
            // - Switched opponent Active to chosen target and then added Confused.
            //
            // Converted to prefab version (SWITCH_IN_OPPONENT_BENCHED_POKEMON).
            (0, prefabs_1.SWITCH_IN_OPPONENT_BENCHED_POKEMON)(store, state, player, {
                allowCancel: false,
                blocked,
                onSwitched: () => {
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                }
            });
        }
        return state;
    }
}
exports.LisiasAppeal = LisiasAppeal;
