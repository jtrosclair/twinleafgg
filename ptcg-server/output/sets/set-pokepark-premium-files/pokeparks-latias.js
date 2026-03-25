"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksLatias = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PokeParksLatias extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Psywave',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Mist Ball',
                cost: [R, W, C],
                damage: 50,
                text: 'Discard a [R] Energy and a [W] Energy attached to this Pokémon.'
            }];
        this.set = 'PPF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'PokéPark\'s Latias';
        this.fullName = 'PokéPark\'s Latias PPF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            store.reduceEffect(state, checkEnergy);
            const energyCount = checkEnergy.energyMap.length;
            effect.damage = 10 * energyCount;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.FIRE, card_types_1.CardType.WATER], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.PokeParksLatias = PokeParksLatias;
