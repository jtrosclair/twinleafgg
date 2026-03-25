"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnteiAndRaikouLegendTop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const entei_and_raikou_legend_bottom_1 = require("./entei-and-raikou-legend-bottom");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class EnteiAndRaikouLegendTop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LEGEND;
        this.tags = [card_types_1.CardTag.LEGEND, card_types_1.CardTag.DUAL_LEGEND];
        this.cardType = R;
        this.additionalCardTypes = [L];
        this.hp = 140;
        this.weakness = [{ type: W }, { type: F }];
        this.retreat = [];
        this.powers = [{
                name: 'Legend Assembly',
                text: 'Put this card from your hand onto your Bench only with the other half of Entei & Raikou LEGEND.',
                exemptFromAbilityLock: true,
                useFromHand: true,
                powerType: game_1.PowerType.LEGEND_ASSEMBLY,
            }];
        this.attacks = [
            {
                name: 'Detonation Spin',
                cost: [R, C],
                damage: 90,
                text: 'Discard a [R] Energy attached to Entei & Raikou LEGEND.'
            },
            {
                name: 'Thunder Fall',
                cost: [L, C],
                damage: 0,
                text: 'Discard all Energy attached to Entei & Raikou LEGEND. This attack does 80 damage to each Pokémon that has any Poké-Powers (both yours and your opponent\'s). This attack\'s damage isn\'t affected by Weakness or Resistance.'
            },
        ];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Entei & Raikou LEGEND';
        this.fullName = 'Entei & Raikou LEGEND (Top) UL';
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
                if (card instanceof EnteiAndRaikouLegendTop && !topPiece) {
                    topPiece = true;
                    topCard = card;
                }
                if (card instanceof entei_and_raikou_legend_bottom_1.EnteiAndRaikouLegendBottom && !bottomPiece) {
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
        // Detonation Spin
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, card_types_1.CardType.FIRE);
        }
        // Thunder Fall
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                // Check if the Pokemon has an Ability
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, card);
                state = store.reduceEffect(state, powersEffect);
                if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.POKEPOWER || power.powerType === game_1.PowerType.POKEMON_POWER)) {
                    // Put 6 damage counters on the Pokemon
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 80);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                // Check if the Pokemon has an Ability
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                state = store.reduceEffect(state, powersEffect);
                if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.POKEPOWER || power.powerType === game_1.PowerType.POKEMON_POWER)) {
                    // Put 6 damage counters on the Pokemon
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 80);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.EnteiAndRaikouLegendTop = EnteiAndRaikouLegendTop;
