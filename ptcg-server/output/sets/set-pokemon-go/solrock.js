"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solrock = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Solrock extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Sun Energy',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may attach a [P] Energy card from your discard pile to 1 of your Lunatone.'
            }];
        this.attacks = [
            {
                name: 'Spinning Attack',
                cost: [F, C],
                damage: 50,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Solrock';
        this.fullName = 'Solrock PGO';
        this.SUN_ENERGY_MARKER = 'SUN_ENERGY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.SUN_ENERGY_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check if player has a Lunatone in play
            let hasLunatone = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.name === 'Lunatone') {
                    hasLunatone = true;
                }
            });
            if (!hasLunatone) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasPsychicEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.PSYCHIC);
            });
            if (!hasPsychicEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.name !== 'Lunatone') {
                    blocked2.push(target);
                }
            });
            if (player.marker.hasMarker(this.SUN_ENERGY_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: false, min: 1, max: 1, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                player.marker.addMarker(this.SUN_ENERGY_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const targetPokemon = target.getPokemonCard();
                    if (targetPokemon && targetPokemon.name === 'Lunatone') {
                        player.discard.moveCardTo(transfer.card, target);
                    }
                }
                return state;
            });
        }
        return state;
    }
}
exports.Solrock = Solrock;
