"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Derail',
                cost: [D],
                damage: 30,
                text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
            },
            {
                name: 'Clutch',
                cost: [D, D],
                damage: 60,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal TEU';
    }
    reduceEffect(store, state, effect) {
        // Derail
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const specialEnergy = opponent.active.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL);
            if (specialEnergy.length === 0) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    opponent.active.moveCardsTo(cards, opponent.discard);
                }
            });
        }
        // Clutch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Yveltal = Yveltal;
