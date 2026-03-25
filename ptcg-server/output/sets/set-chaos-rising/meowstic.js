"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowstic = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const card_types_2 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const play_card_action_2 = require("../../game/store/actions/play-card-action");
class Meowstic extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Espurr';
        this.hp = 100;
        this.cardType = P;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Trick Step',
                cost: [P, C],
                damage: 80,
                text: 'You may move an Energy attached to your opponent\'s Active Pokemon to 1 of their Benched Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Meowstic';
        this.fullName = 'Meowstic M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            const hasEnergy = opponent.active.cards.some(c => c.superType === card_types_2.SuperType.ENERGY);
            if (hasBench && hasEnergy) {
                return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_CARDS, opponent.active, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_2.SlotType.BENCH], { superType: card_types_2.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                    const list = transfers || [];
                    for (const t of list) {
                        const target = game_1.StateUtils.getTarget(state, player, t.to);
                        opponent.active.moveCardTo(t.card, target);
                    }
                });
            }
        }
        return state;
    }
}
exports.Meowstic = Meowstic;
