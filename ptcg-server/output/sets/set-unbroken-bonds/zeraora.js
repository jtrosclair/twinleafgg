"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zeraora = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zeraora extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Crushing Claw',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
            },
            {
                name: 'Discharge',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Discard all [L] Energy from this Pokémon. This attack does 50 damage for each card you discarded in this way. '
            }];
        this.set = 'UNB';
        this.setNumber = '60';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zeraora';
        this.fullName = 'Zeraora UNB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active;
            let hasSpecialEnergy = false;
            // Checking to see if Opp active has any special energy
            opponentActive.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    if (c.energyType === card_types_1.EnergyType.SPECIAL) {
                        hasSpecialEnergy = true;
                    }
                }
            });
            // If no special energy, pass turn, else, ask player to pick a special energy to discard from Opp active
            if (!hasSpecialEnergy) {
                return state;
            }
            else {
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, opponentActive, // Card source is target Pokemon
                { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = opponentActive;
                        opponentActive.moveCardsTo(cards, opponent.discard);
                        return state;
                    }
                    return state;
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let totalDiscarded = 0;
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            totalDiscarded += discardEnergy.cards.length;
            store.reduceEffect(state, discardEnergy);
            effect.damage += (totalDiscarded - 1) * 50;
        }
        return state;
    }
}
exports.Zeraora = Zeraora;
