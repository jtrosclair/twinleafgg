"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latios = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
class Latios extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 130;
        this.retreat = [C];
        this.powers = [{
                name: 'Luster Assist',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, when your Mega Latias ex moves from the Bench to the Active Spot, you may move any number of Energy from your Benched Pokémon to that Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Dragon Claw',
                cost: [W, P, C],
                damage: 130,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '101';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latios';
        this.fullName = 'Latios M1S';
        this.LUSTER_ASSIST_MARKER = 'LUSTER_ASSIST_MARKER';
    }
    reduceEffect(store, state, effect) {
        const player = game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this));
        if (player === undefined) {
            return state;
        }
        const activePokemon = player.active.getPokemonCard();
        if (activePokemon && activePokemon.name === 'M Latias-EX' && activePokemon.movedToActiveThisTurn) {
            if (!player.marker.hasMarker(this.LUSTER_ASSIST_MARKER, this)) {
                let hasEnergyOnBench = false;
                player.bench.forEach((b) => {
                    if (b.cards.some((c) => c instanceof energy_card_1.EnergyCard)) {
                        hasEnergyOnBench = true;
                    }
                });
                if (hasEnergyOnBench) {
                    state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                        if (wantToUse) {
                            player.marker.addMarker(this.LUSTER_ASSIST_MARKER, this);
                            const blockedFrom = [{ player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }];
                            const blockedTo = [];
                            player.bench.forEach((b, index) => {
                                blockedTo.push({ player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: index });
                            });
                            store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, blockedFrom, blockedTo }), transfers => {
                                transfers = transfers || [];
                                for (const transfer of transfers) {
                                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                                    source.moveCardTo(transfer.card, player.active);
                                }
                            });
                        }
                    });
                }
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            player.marker.removeMarker(this.LUSTER_ASSIST_MARKER, this);
        }
        return state;
    }
}
exports.Latios = Latios;
