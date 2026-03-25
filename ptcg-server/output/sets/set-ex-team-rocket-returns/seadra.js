"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seadra = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Seadra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Horsea';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Confuse Ray',
                cost: [W, C],
                damage: 10,
                text: 'The Defending Pokémon is now Confused.'
            },
            {
                name: 'Aqua Trick',
                cost: [W, C, C],
                damage: 30,
                text: 'Move 1 Energy card attached to the Defending Pokémon to 1 of your opponent\'s Benched Pokémon. If your opponent has no Benched Pokémon, this effect does nothing.'
            }];
        this.set = 'TRR';
        this.name = 'Seadra';
        this.fullName = 'Seadra TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
    }
    reduceEffect(store, state, effect) {
        //Attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, opponent.active, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARD_TO)(state, transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Seadra = Seadra;
