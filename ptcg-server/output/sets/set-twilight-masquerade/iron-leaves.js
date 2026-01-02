"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronLeaves = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class IronLeaves extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.FUTURE];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Recovery Net',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Choose up to 2 Pokémon from your discard pile, reveal them, and put them into your hand.'
            },
            {
                name: 'Avenging Edge',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 60 more damage.'
            }
        ];
        this.set = 'TWM';
        this.name = 'Iron Leaves';
        this.fullName = 'Iron Leaves TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemonCount = player.discard.cards.filter(c => {
                return c instanceof pokemon_card_1.PokemonCard;
            }).length;
            if (pokemonCount === 0) {
                return state;
            }
            const max = Math.min(2, pokemonCount);
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            if (effect.player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.IronLeaves = IronLeaves;
