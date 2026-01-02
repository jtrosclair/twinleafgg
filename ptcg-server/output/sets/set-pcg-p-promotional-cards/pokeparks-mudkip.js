"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksMudkip = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class PokeParksMudkip extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mud-Slap',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Flamethrower',
                cost: [W, C, C],
                damage: 30,
                text: 'Flip a coin. If heads, discard an Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'PCGP';
        this.name = 'PokéPark\'s Mudkip';
        this.fullName = 'PokéPark\'s Mudkip PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (result) {
                    const player = effect.player;
                    const opponent = effect.opponent;
                    // If defending Pokemon has no energy cards attached, return early
                    if (!opponent.active.energies.cards.some(c => c instanceof game_1.EnergyCard)) {
                        return state;
                    }
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        return store.reduceEffect(state, new attack_effects_1.DiscardCardsEffect(effect, [card]));
                    });
                }
            });
        }
        return state;
    }
}
exports.PokeParksMudkip = PokeParksMudkip;
