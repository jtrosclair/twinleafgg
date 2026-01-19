"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meowth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Plunder',
                cost: [C],
                damage: 10,
                text: 'Before doing damage, discard all Trainer cards attached to the Defending Pokémon (before they affect the damage).'
            },
            {
                name: 'Scratch',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'NP';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meowth';
        this.fullName = 'Meowth NP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard active Pokemon's tool first
            const activePokemon = opponent.active;
            const toolsToDiscard = activePokemon.tools.filter(card => card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL);
            if (toolsToDiscard.length > 0) {
                activePokemon.moveCardsTo(toolsToDiscard, opponent.discard);
            }
        }
        return state;
    }
}
exports.Meowth = Meowth;
