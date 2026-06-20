"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCenter = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ShoppingCenter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Shopping Center';
        this.fullName = 'Shopping Center EVS';
        this.text = 'Once during each player\'s turn, that player may put a Pokémon Tool attached to 1 of their Pokémon into their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            let pokemonWithTool = false;
            const blockedTo = [];
            if (player.active.tools.length !== 0) {
                pokemonWithTool = true;
            }
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                if (bench.tools.length !== 0) {
                    pokemonWithTool = true;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!pokemonWithTool) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const target = targets[0];
                const tool = target.tools[0];
                if (tool) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, target, player.hand, { cards: [tool], sourceCard: this });
                }
            });
        }
        return state;
    }
}
exports.ShoppingCenter = ShoppingCenter;
