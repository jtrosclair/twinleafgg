"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuicuneAndEnteiLegendBottom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const suicune_and_entei_legend_top_1 = require("./suicune-and-entei-legend-top");
class SuicuneAndEnteiLegendBottom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LEGEND;
        this.tags = [card_types_1.CardTag.LEGEND, card_types_1.CardTag.DUAL_LEGEND];
        this.cardType = R;
        this.additionalCardTypes = [W];
        this.hp = 160;
        this.weakness = [{ type: W }, { type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Legend Assembly',
                text: 'Put this card from your hand onto your Bench only with the other half of Entei & Raikou LEGEND.',
                exemptFromAbilityLock: true,
                useFromHand: true,
                powerType: game_1.PowerType.LEGEND_ASSEMBLY,
            }];
        this.attacks = [{
                name: 'Torrent Blade',
                cost: [W, W, C],
                damage: 0,
                text: 'Return 2 [W] Energy attached to Suicune & Entei LEGEND to your hand. Choose 1 of your opponent\'s Benched Pokémon. This attack does 100 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Bursting Inferno',
                cost: [R, C, C],
                damage: 80,
                text: 'The Defending Pokémon is now Burned.'
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Suicune & Entei LEGEND';
        this.fullName = 'Suicune & Entei LEGEND (Bottom) UL';
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
                if (card instanceof suicune_and_entei_legend_top_1.SuicuneAndEnteiLegendTop && !topPiece) {
                    topPiece = true;
                    topCard = card;
                }
                if (card instanceof SuicuneAndEnteiLegendBottom && !bottomPiece) {
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
        return state;
    }
}
exports.SuicuneAndEnteiLegendBottom = SuicuneAndEnteiLegendBottom;
