"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZacianV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ZacianV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = M;
        this.hp = 220;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.resistance = [{ type: G, value: -30 }];
        this.powers = [{
                name: 'Intrepid Sword',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may look at the top 3 cards of your deck and attach any number of [M] Energy cards you find there to this Pokémon. Put the other cards into your hand. If you use this Ability, your turn ends.'
            }];
        this.attacks = [{
                name: 'Brave Blade',
                cost: [M, M, M],
                damage: 230,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'SSH';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '138';
        this.name = 'Zacian V';
        this.fullName = 'Zacian V SSH';
        this.BRAVE_BLADE_MARKER = 'BRAVE_BLADE_MARKER';
        this.BRAVE_BLADE_MARKER_2 = 'BRAVE_BLADE_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        // Intrepid Sword
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const topdecks = new game_1.CardList();
            player.deck.moveTo(topdecks, 3);
            // Find the slot for this Zacian V using the new system
            const zacianSlot = game_1.StateUtils.findPokemonSlot(state, this);
            if (!zacianSlot) {
                // Should never happen, but safety check
                return state;
            }
            // Find the CardTarget for this Zacian V slot
            let zacianTarget;
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (list === zacianSlot && card === this) {
                    zacianTarget = target;
                }
                else {
                    blockedTo.push(target);
                }
            });
            if (!zacianTarget) {
                // Should never happen, but safety check
                return state;
            }
            // Filter Metal Energy
            const metalEnergies = topdecks.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Metal Energy');
            const metals = metalEnergies.length;
            if (metals === 0) {
                topdecks.moveTo(player.hand);
            }
            else {
                // Only allow attaching to this Zacian V
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, topdecks, game_1.PlayerType.BOTTOM_PLAYER, 
                // Only this Zacian V's slot
                [zacianTarget.slot], { superType: card_types_1.SuperType.ENERGY, name: 'Metal Energy' }, { allowCancel: false, min: 0, max: metals, sameTarget: true, blockedTo }), transfers => {
                    transfers = transfers || [];
                    // Attach selected Metal Energies to this Zacian V
                    for (const transfer of transfers) {
                        // Only allow attaching to this Zacian V
                        if (transfer.to.player === zacianTarget.player &&
                            transfer.to.slot === zacianTarget.slot &&
                            transfer.to.index === zacianTarget.index) {
                            topdecks.moveCardTo(transfer.card, game_1.StateUtils.getTarget(state, player, transfer.to));
                        }
                    }
                    // Move the rest to hand
                    topdecks.moveTo(player.hand);
                });
            }
            // end the turn
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            return store.reduceEffect(state, endTurnEffect);
        }
        // Brave Blade
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            player.marker.addMarker(this.BRAVE_BLADE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER_2, this)) {
            effect.player.marker.removeMarker(this.BRAVE_BLADE_MARKER, this);
            effect.player.marker.removeMarker(this.BRAVE_BLADE_MARKER_2, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER, this)) {
            effect.player.marker.addMarker(this.BRAVE_BLADE_MARKER_2, this);
        }
        return state;
    }
}
exports.ZacianV = ZacianV;
