"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eelektrik = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Eelektrik extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tynamo';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Headbutt',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Shock Bolt',
                cost: [L, L, C],
                damage: 80,
                text: 'Discard all [L] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '46';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eelektrik';
        this.fullName = 'Eelektrik DEX';
    }
    reduceEffect(store, state, effect) {
        // Headbutt - vanilla attack, no effect needed
        // Shock Bolt - discard all Lightning energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const lightningEnergy = player.active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY &&
                card.energyType === card_types_1.EnergyType.BASIC &&
                card.provides.includes(card_types_1.CardType.LIGHTNING));
            if (lightningEnergy.length > 0) {
                const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, lightningEnergy);
                store.reduceEffect(state, discardEffect);
            }
        }
        return state;
    }
}
exports.Eelektrik = Eelektrik;
