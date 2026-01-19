"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyogre = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Kyogre extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 150;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Riptide',
                cost: [W],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each [W] Energy card in your discard pile. Then, shuffle those cards into your deck.'
            },
            {
                name: 'Swirling Waves',
                cost: [W, W, C],
                damage: 130,
                text: 'Discard 2 Energy from this Pokémon.'
            }];
        this.set = 'MEG';
        this.name = 'Kyogre';
        this.fullName = 'Kyogre M1S';
        this.setNumber = '34';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Surging Flames
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // counting the energies
            const energiesInDiscard = player.discard.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Water Energy');
            if (energiesInDiscard.length === 0) {
                return state;
            }
            effect.damage = 20 * energiesInDiscard.length;
            // slapping those energies back into the deck
            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards: energiesInDiscard, sourceCard: this, sourceEffect: this.attacks[0] });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
        }
        return state;
    }
}
exports.Kyogre = Kyogre;
