"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenusaurSnivyGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class VenusaurSnivyGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 270;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Shining Vine',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is your Active Pokémon, when you attach a [G] Energy card from your hand to it, you may switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Forest Dump',
                cost: [G, C, C, C],
                damage: 160,
                text: ''
            },
            {
                name: 'Solar Plant-GX',
                cost: [C, C, C],
                damage: 0,
                gxAttack: true,
                text: 'This attack does 50 damage to each of your opponent\'s Pokémon. If this Pokémon has at least 2 extra Energy attached to it (in addition to this attack\'s cost), heal all damage from all of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'CEC';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Venusaur & Snivy-GX';
        this.fullName = 'Venusaur & Snivy-GX CEC';
        this.SHINING_VINE_MARKER = 'SHINING_VINE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Shining Vine
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let benchHasPokemon = false;
            // checking if it's the active pokemon, it's ability isn't being blocked, and if the card provides grass specifically
            if (player.active.getPokemonCard() !== this) {
                return state;
            }
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            if (!effect.energyCard.provides.includes(game_1.CardType.GRASS)) {
                return state;
            }
            // checking if the opponent has any benched pokemon
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== opponent.active) {
                    benchHasPokemon = true;
                }
            });
            if (!benchHasPokemon) {
                return state;
            }
            // checking if this has already been used this turn
            if (player.active.marker.hasMarker(this.SHINING_VINE_MARKER, this)) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        player.active.marker.addMarker(this.SHINING_VINE_MARKER, this);
                        player.marker.addMarker(this.SHINING_VINE_MARKER, this);
                        opponent.switchPokemon(cardList);
                    });
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SHINING_VINE_MARKER, this)) {
            effect.player.marker.removeMarker(this.SHINING_VINE_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card.marker.hasMarker(this.SHINING_VINE_MARKER, this)) {
                    card.marker.removeMarker(this.SHINING_VINE_MARKER, this);
                }
            });
        }
        // Solar Plant-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                const damage = new attack_effects_1.DealDamageEffect(effect, 50);
                damage.target = card;
                store.reduceEffect(state, damage);
            });
            const extraEffectCost = [C, C, C, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                    const healing = new game_effects_1.HealEffect(player, card, card.damage);
                    store.reduceEffect(state, healing);
                });
            }
        }
        return state;
    }
}
exports.VenusaurSnivyGX = VenusaurSnivyGX;
