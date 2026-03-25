"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gigalith = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gigalith extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Boldore';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Shear',
                cost: [F],
                damage: 0,
                text: 'Discard the top 5 cards of your deck. If any of those cards are [F] Energy cards, attach them to this Pokémon.'
            },
            {
                name: 'Rock Bullet',
                cost: [C, C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 20 more damage for each [F] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Gigalith';
        this.fullName = 'Gigalith EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardsToDiscard = player.deck.cards.slice(0, 5);
            cardsToDiscard.forEach(card => {
                if (card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Fighting Energy') {
                    player.deck.moveCardTo(card, player.active);
                }
                else {
                    player.deck.moveCardTo(card, player.discard);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkEnergy);
            let fightingEnergy = 0;
            checkEnergy.energyMap.forEach(em => {
                fightingEnergy += em.provides.filter(p => p === card_types_1.CardType.FIGHTING).length;
            });
            effect.damage += 20 * fightingEnergy;
        }
        return state;
    }
}
exports.Gigalith = Gigalith;
