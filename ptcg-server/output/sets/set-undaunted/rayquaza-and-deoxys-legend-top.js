"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaAndDeoxysLegendTop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const rayquaza_and_deoxys_legend_bottom_1 = require("./rayquaza-and-deoxys-legend-bottom");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class RayquazaAndDeoxysLegendTop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LEGEND;
        this.tags = [card_types_1.CardTag.LEGEND, card_types_1.CardTag.DUAL_LEGEND];
        this.cardType = C;
        this.additionalCardTypes = [P];
        this.hp = 140;
        this.weakness = [{ type: C }, { type: P }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Legend Assembly',
                text: 'Put this card from your hand onto your Bench only with the other half of Rayquaza & Deoxys LEGEND.',
                exemptFromAbilityLock: true,
                useFromHand: true,
                powerType: game_1.PowerType.LEGEND_ASSEMBLY,
            },
            {
                name: 'Space Virus',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If your opponent\'s Pokémon is Knocked Out by damage from an attack of Rayquaza & Deoxys LEGEND, take 1 more Prize card.',
            }];
        this.attacks = [{
                name: 'Ozone Buster',
                cost: [R, R, L, C],
                damage: 150,
                text: 'Discard all [R] Energy attached to Rayquaza & Deoxys LEGEND.'
            }];
        this.set = 'UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.name = 'Rayquaza & Deoxys LEGEND';
        this.fullName = 'Rayquaza & Deoxys LEGEND (Top) UD';
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
                if (card instanceof RayquazaAndDeoxysLegendTop && !topPiece) {
                    topPiece = true;
                    topCard = card;
                }
                if (card instanceof rayquaza_and_deoxys_legend_bottom_1.RayquazaAndDeoxysLegendBottom && !bottomPiece) {
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
        // Space Virus
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Lugia wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (effect.prizeCount > 0) {
                effect.prizeCount += 1;
                return state;
            }
        }
        // Ozone Buster
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            checkProvidedEnergy.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.FIRE) || em.provides.includes(card_types_1.CardType.ANY)) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.discard, { cards: [em.card] });
                }
            });
        }
        return state;
    }
}
exports.RayquazaAndDeoxysLegendTop = RayquazaAndDeoxysLegendTop;
