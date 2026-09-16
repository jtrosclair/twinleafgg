"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xerneas = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
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
            return (0, prefabs_1.ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON)(store, state, effect.player, 2, 2, {
                destinationSlots: [play_card_action_1.SlotType.BENCH],
                energyFilter: { energyType: card_types_1.EnergyType.BASIC },
                allowCancel: false,
                min: 0,
                differentTargets: true,
                validCardTypes: [card_types_1.CardType.FAIRY]
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
