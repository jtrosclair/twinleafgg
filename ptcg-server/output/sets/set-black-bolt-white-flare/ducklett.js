"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ducklett = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ducklett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Firefighting',
                cost: [C],
                damage: 0,
                text: 'Discard a [R] Energy from your opponent\'s Active Pokémon.'
            },
            {
                name: 'Wing Attack',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.name = 'Ducklett';
        this.fullName = 'Ducklett SV11W';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const energyList = [];
            for (let i = 0; i < 1; i++) {
                energyList.push(card_types_1.CardType.FIRE);
            }
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyList, { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = opponent.active;
                return store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Ducklett = Ducklett;
