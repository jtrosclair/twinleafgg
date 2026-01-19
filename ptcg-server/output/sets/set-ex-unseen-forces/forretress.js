"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forretress = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Forretress extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pineco';
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Spiky Shell',
                cost: [C, C],
                damage: 20,
                text: 'Put 3 damage counters on the Defending Pokémon at the end of your opponent\'s next turn.'
            },
            {
                name: 'Pop',
                cost: [M, C, C, C],
                damage: 100,
                text: 'Put 7 damage counters on Forretress. Move all Energy cards attached to Forretress to your Benched Pokémon in any way you like. (Ignore this effect if you don\'t have any Benched Pokémon.)'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Forretress';
        this.fullName = 'Forretress UF';
        this.COUNTERS_MARKER = 'COUNTERS_MARKER';
        this.CLEAR_COUNTERS_MARKER = 'CLEAR_COUNTERS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            // Apply Spiky Shell effect at the end of opponent's next turn
            effect.player.marker.addMarker(this.COUNTERS_MARKER, this);
            opponent.active.marker.addMarker(this.CLEAR_COUNTERS_MARKER, this);
        }
        // 30 damage to opponent's active if end turn and counters marker is present
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_COUNTERS_MARKER, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.player.active.damage += 30;
            effect.player.active.marker.removeMarker(this.CLEAR_COUNTERS_MARKER, this);
            opponent.marker.removeMarker(this.COUNTERS_MARKER, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.COUNTERS_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // 7 damage counters on Forretress
            const putCounters = new attack_effects_1.PutCountersEffect(effect, 70);
            putCounters.target = effect.source;
            store.reduceEffect(state, putCounters);
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            // Get attached energy cards
            const attachedEnergies = player.active.cards.filter(card => {
                return card instanceof game_1.EnergyCard;
            });
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: attachedEnergies.length, max: attachedEnergies.length }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Forretress = Forretress;
