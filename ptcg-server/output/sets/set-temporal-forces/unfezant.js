"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unfezant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Unfezant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tranquill';
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Opposing Winds',
                cost: [C, C],
                damage: 70,
                text: 'You may put 2 Energy attached to your opponent\'s Active Pokémon into their hand.'
            },
            {
                name: 'Boundless Power',
                cost: [C, C, C],
                damage: 180,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.setNumber = '135';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Unfezant';
        this.fullName = 'Unfezant TEF';
    }
    reduceEffect(store, state, effect) {
        // Opposing Winds
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 2, allowCancel: false }), selected => {
                cards = selected || [];
                opponent.active.moveCardsTo(cards, opponent.hand);
            });
        }
        // Boundless Power
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Legacy implementation:
            // - Set player.active.cannotAttackNextTurnPending = true directly.
            //
            // Converted to prefab version (THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN).
            (0, prefabs_1.THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN)(player);
        }
        return state;
    }
}
exports.Unfezant = Unfezant;
