"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xerneas = void 0;
const game_1 = require("../../game");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Xerneas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Geomancy',
                cost: [Y],
                damage: 0,
                text: 'Choose 2 of your Benched Pokémon. For each of those Pokémon, search your deck for a [Y] Energy card and attach it to that Pokémon. Shuffle your deck afterward.'
            }, {
                name: 'Rainbow Spear',
                cost: [Y, Y, C],
                damage: 100,
                text: 'Discard an Energy attached to this Pokémon.'
            }];
        this.set = 'STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Xerneas';
        this.fullName = 'Xerneas STS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                return state;
            }
            const benchSpots = player.bench.filter(b => b.cards.length > 0).length;
            const min = Math.min(2, benchSpots);
            const max = Math.min(2, benchSpots);
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fairy Energy' }, { allowCancel: false, min, max, differentTargets: true }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    return;
                }
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                return state;
            });
        }
        // Rainbow Spear
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Xerneas = Xerneas;
