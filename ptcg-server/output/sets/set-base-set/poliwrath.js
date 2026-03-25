"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poliwrath = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Poliwrath extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Poliwrath';
        this.set = 'BS';
        this.fullName = 'Poliwrath BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Does 30 damage plus 10 more damage for each [W] Energy attached to Poliwrath but not used to pay for this attack\'s Energy cost. Extra [W] Energy after the 2nd doesn\'t count.'
            },
            {
                name: 'Whirlpool',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
            state = store.reduceEffect(state, checkCost);
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Filter for Water energies
            const waterEnergies = checkEnergy.energyMap.filter(e => e.provides.includes(card_types_1.CardType.WATER));
            // Add damage for extra Water energies up to 2
            const extraEnergies = Math.min(waterEnergies.length - checkCost.cost.length, 2);
            effect.damage += extraEnergies * 10;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activeCardList = opponent.active;
            const activePokemonCard = activeCardList.getPokemonCard();
            let hasPokemonWithEnergy = false;
            if (activePokemonCard && activeCardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                hasPokemonWithEnergy = true;
            }
            if (!hasPokemonWithEnergy) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
            });
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.Poliwrath = Poliwrath;
