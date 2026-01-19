"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyogreAndGroudonLegendTop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const kyogre_and_groudon_legend_bottom_1 = require("./kyogre-and-groudon-legend-bottom");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class KyogreAndGroudonLegendTop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LEGEND;
        this.tags = [card_types_1.CardTag.LEGEND, card_types_1.CardTag.DUAL_LEGEND];
        this.cardType = W;
        this.additionalCardTypes = [F];
        this.hp = 150;
        this.weakness = [{ type: G }, { type: L }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'Legend Assembly',
                text: 'Put this card from your hand onto your Bench only with the other half of Kyogre & Groudon LEGEND.',
                exemptFromAbilityLock: true,
                useFromHand: true,
                powerType: game_1.PowerType.LEGEND_ASSEMBLY,
            },
        ];
        this.attacks = [
            {
                name: 'Mega Tidal Wave',
                cost: [W, W, C, C],
                damage: 0,
                text: 'Discard the top 5 cards from your opponent\'s deck. This attack does 30 damage times the number of Energy cards you discarded to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Massive Eruption',
                cost: [F, F, C, C],
                damage: 100,
                damageCalculation: 'x',
                text: 'Discard the top 5 cards from your deck. This attack does 100 damage times the number of Energy cards you discarded.'
            },
        ];
        this.set = 'UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Kyogre & Groudon LEGEND';
        this.fullName = 'Kyogre & Groudon LEGEND (Top) UD';
    }
    reduceEffect(store, state, effect) {
        // assemblin the avengers
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (slots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let topPiece = false;
            let bottomPiece = false;
            let topCard = null;
            let bottomCard = null;
            player.hand.cards.forEach(card => {
                if (card instanceof KyogreAndGroudonLegendTop && !topPiece) {
                    topPiece = true;
                    topCard = card;
                }
                if (card instanceof kyogre_and_groudon_legend_bottom_1.KyogreAndGroudonLegendBottom && !bottomPiece) {
                    bottomPiece = true;
                    bottomCard = card;
                }
            });
            if (topPiece && bottomPiece && topCard && bottomCard) {
                if (slots.length > 0) {
                    player.hand.moveCardTo(bottomCard, slots[0]);
                    player.hand.moveCardTo(topCard, slots[0]);
                    slots[0].pokemonPlayedTurn = state.turn;
                }
            }
            else {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
        }
        // Mega Tidal Wave
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const deckTop = new game_1.CardList();
            // Move top 5 cards from deckTop
            opponent.deck.moveTo(deckTop, 5);
            // Filter for Energy cards
            const energyCount = deckTop.cards.filter(c => c instanceof game_1.EnergyCard);
            const attackDamage = energyCount.length * 30;
            // Move all cards to discard
            (0, prefabs_1.MOVE_CARDS)(store, state, deckTop, opponent.discard, { count: deckTop.cards.length, sourceCard: this, sourceEffect: this.attacks[0] });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList !== opponent.active) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, attackDamage);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        // Massive Eruption
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const deckTop = new game_1.CardList();
            // Move top 5 cards from deckTop
            player.deck.moveTo(deckTop, 5);
            // Filter for Energy cards
            const energyCount = deckTop.cards.filter(c => c instanceof game_1.EnergyCard);
            // Move all cards to discard
            deckTop.moveTo(player.discard, deckTop.cards.length);
            effect.damage = energyCount.length * 100;
        }
        return state;
    }
}
exports.KyogreAndGroudonLegendTop = KyogreAndGroudonLegendTop;
