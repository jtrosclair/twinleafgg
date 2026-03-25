"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machamp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Machamp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Machoke';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Derail',
                cost: [F, C],
                damage: 40,
                text: 'Discard a Special Energy card, if any, attached to the Defending Pokémon.'
            },
            {
                name: 'Swift Blow',
                cost: [F, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Does 60 damage plus 20 damage for each React Energy card attached to Machamp.'
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Machamp';
        this.fullName = 'Machamp LM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, oppActive);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard.superType === card_types_1.SuperType.ENERGY && energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, oppActive, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected;
                    });
                    (0, prefabs_1.MOVE_CARDS)(store, state, oppActive, opponent.discard, { cards: cards, sourceCard: this, sourceEffect: this.attacks[0] });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let energyCount = 0;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.card.name === 'React Energy') {
                    energyCount++;
                }
            });
            effect.damage += 20 * energyCount;
        }
        return state;
    }
}
exports.Machamp = Machamp;
