"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croconaw = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Croconaw extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Totodile';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Crunch',
                cost: [W, W],
                damage: 50,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Croconaw';
        this.fullName = 'Croconaw MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    return store.prompt(state, new game_1.DiscardEnergyPrompt(effect.player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE], {}, { allowCancel: false, min: 1, max: 1 }), transfers => {
                        transfers = transfers || [];
                        if (transfers.length > 0) {
                            const target = game_1.StateUtils.getTarget(state, effect.opponent, transfers[0].from);
                            target.moveCardTo(transfers[0].card, effect.opponent.discard);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Croconaw = Croconaw;
