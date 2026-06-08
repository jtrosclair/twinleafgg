"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cobalionex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cobalionex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 210;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Metal Road',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when this Pokemon moves from your Bench to the Active Spot, you may move any amount of [M] Energy from your Pokemon in play to this Pokemon.'
            }];
        this.attacks = [{
                name: 'Power Tackle',
                cost: [M, M, C],
                damage: 200,
                text: 'During your next turn, this Pokemon can\'t attack.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.usSetNumber = 'CRI 62';
        this.name = 'Cobalion ex';
        this.fullName = 'Cobalion ex M4';
        this.METAL_ROAD_MARKER = 'METAL_ROAD_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.METAL_ROAD_MARKER, this);
        const player = state.players[state.activePlayer];
        if (effect instanceof game_effects_1.MovedToActiveEffect && effect.pokemonCard === this
            && state.players[state.activePlayer] === effect.player
            && (0, prefabs_1.MOVED_TO_ACTIVE_THIS_TURN)(effect.player, this)) {
            if (player.marker.hasMarker(this.METAL_ROAD_MARKER, this)) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (!wantToUse) {
                    player.marker.addMarker(this.METAL_ROAD_MARKER, this);
                    return;
                }
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
                const blockedFrom = [];
                const blockedTo = [];
                const blockedMap = [];
                let hasMetalOrAnyEnergy = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList === player.active) {
                        blockedFrom.push(target);
                        return;
                    }
                    blockedTo.push(target);
                    // Block cards that do NOT provide Metal or Any (Colorless)
                    const blocked = [];
                    cardList.cards.forEach((c, index) => {
                        const providesMetalOrAny = c instanceof game_1.EnergyCard
                            && (c.provides.includes(game_1.CardType.METAL) || c.provides.includes(game_1.CardType.ANY));
                        if (!providesMetalOrAny) {
                            blocked.push(index);
                        }
                        else {
                            hasMetalOrAnyEnergy = true;
                        }
                    });
                    if (blocked.length > 0) {
                        blockedMap.push({ source: target, blocked });
                    }
                });
                if (!hasMetalOrAnyEnergy) {
                    return state;
                }
                return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], // Only allow moving to active
                { superType: game_1.SuperType.ENERGY }, { allowCancel: true, blockedFrom, blockedTo, blockedMap }), transfers => {
                    // Add marker whether user moved energy or cancelled - once-per-turn consumed
                    player.marker.addMarker(this.METAL_ROAD_MARKER, this);
                    if (!transfers || transfers.length === 0) {
                        return;
                    }
                    const target = player.active;
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        source.moveCardTo(transfer.card, target);
                    }
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Cobalionex = Cobalionex;
