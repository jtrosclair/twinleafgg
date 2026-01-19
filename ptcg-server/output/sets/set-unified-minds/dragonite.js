"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Dragonite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.cardType = N;
        this.hp = 160;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Hurricane Charge',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach a [W] Energy card, a [L] Energy card, or 1 of each from your hand to your Pokémon in any way you like.'
            }];
        this.attacks = [{
                name: 'Dragon Impact',
                cost: [W, L, C, C],
                damage: 170,
                text: 'Discard 3 Energy from this Pokémon.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.name = 'Dragonite';
        this.fullName = 'Dragonite UNM';
        this.HURRICANE_CHARGE_MARKER = 'HURRICANE_CHARGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.HURRICANE_CHARGE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.HURRICANE_CHARGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.HURRICANE_CHARGE_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 3);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && (c.provides.includes(card_types_1.CardType.WATER) || (c.provides.includes(card_types_1.CardType.LIGHTNING)));
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.HURRICANE_CHARGE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                checkProvidedEnergy.energyMap.forEach((em, index) => {
                    if (!(em.provides.includes(card_types_1.CardType.WATER) || em.provides.includes(card_types_1.CardType.LIGHTNING))) {
                        const globalIndex = cardList.cards.indexOf(em.card);
                        if (globalIndex !== -1 && !blocked.includes(globalIndex)) {
                            blocked.push(globalIndex);
                        }
                    }
                });
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, {
                allowCancel: false,
                min: 1,
                max: 2,
                blocked,
                differentTypes: true,
                validCardTypes: [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING]
            }), transfers => {
                transfers = transfers || [];
                player.marker.addMarker(this.HURRICANE_CHARGE_MARKER, this);
                if (transfers.length === 0) {
                    return state;
                }
                if (transfers.length > 1) {
                    if (transfers[0].card.name === transfers[1].card.name) {
                        throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                    }
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Dragonite = Dragonite;
