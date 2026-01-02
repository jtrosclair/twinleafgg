"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clawitizer = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Clawitizer extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Clauncher';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Reverse and Reload',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when this Pokémon moves from the Active Spot to the Bench, you may use this Ability. Attach up to 2 Basic [W] Energy cards from your hand to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Aqua Launcher',
                cost: [W, W, W],
                damage: 210,
                text: 'Discard all Energy from this Pokémon.'
            }];
        this.set = 'MEG';
        this.setNumber = '38';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Clawitizer M1S';
        this.name = 'Clawitizer';
        this.ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        const cardList = game_1.StateUtils.findCardList(state, this);
        const owner = game_1.StateUtils.findOwner(state, cardList);
        const player = state.players[state.activePlayer];
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (player === owner && !player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            if (this.movedToActiveThisTurn === true) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                const energyCards = player.hand.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === game_1.EnergyType.BASIC && c.name === 'Water Energy');
                if (energyCards.length === 0) {
                    return state;
                }
                state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        const hasEnergyInHand = player.hand.cards.some(c => {
                            return c instanceof game_1.EnergyCard
                                && c.energyType === game_1.EnergyType.BASIC
                                && c.provides.includes(game_1.CardType.WATER);
                        });
                        if (!hasEnergyInHand) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                        }
                        const cardList = game_1.StateUtils.findCardList(state, this);
                        if (cardList === undefined) {
                            return state;
                        }
                        return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: 2, allowCancel: false }), cards => {
                            cards = cards || [];
                            if (cards.length > 0) {
                                player.hand.moveCardsTo(cards, cardList);
                            }
                        });
                    }
                });
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        }
        return state;
    }
}
exports.Clawitizer = Clawitizer;
