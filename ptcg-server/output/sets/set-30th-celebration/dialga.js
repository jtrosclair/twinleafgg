"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialga = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dialga extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = card_types_1.CardType.METAL;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Reversed Clock',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Shuffle up to 3 in any combination of Pokémon and Basic Energy cards from your discard pile into your deck.'
            },
            {
                name: 'Heavy Impact',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Dialga';
        this.fullName = 'Dialga 30C';
    }
    reduceEffect(store, state, effect) {
        // Reversed Clock
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            let validCount = 0;
            player.discard.cards.forEach((c, index) => {
                const isPokemon = c instanceof pokemon_card_1.PokemonCard;
                const isBasicEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
                if (isPokemon || isBasicEnergy) {
                    validCount += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            if (validCount === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 0, max: Math.min(3, validCount), allowCancel: true, blocked }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards: cards, sourceCard: this });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
            });
        }
        return state;
    }
}
exports.Dialga = Dialga;
