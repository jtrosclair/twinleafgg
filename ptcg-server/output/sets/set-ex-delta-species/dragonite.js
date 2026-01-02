"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const energy_card_1 = require("../../game/store/card/energy-card");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Dragonite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.cardType = L;
        this.additionalCardTypes = [M];
        this.hp = 100;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Delta Charge',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may attach a [L] Energy card from your discard pile to 1 of your Benched Pokémon. This power can\'t be used if Dragonite is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Agility',
                cost: [L, C],
                damage: 30,
                text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Dragonite during your opponent\'s next turn.'
            },
            {
                name: 'Heavy Impact',
                cost: [L, M, C, C],
                damage: 70,
                text: ''
            }];
        this.set = 'DS';
        this.name = 'Dragonite';
        this.fullName = 'Dragonite DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.DELTA_CHARGE_MARKER = 'DELTA_CHARGE_MARKER';
        this.AGILITY_MARKER = 'AGILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DELTA_CHARGE_MARKER, this);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof energy_card_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.LIGHTNING);
            });
            if (!hasEnergyInDiscard) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.DELTA_CHARGE_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                prefabs_1.ABILITY_USED(player, this);
                prefabs_1.ADD_MARKER(this.DELTA_CHARGE_MARKER, player, this);
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.AGILITY_MARKER, this);
                    prefabs_1.ADD_MARKER(this.AGILITY_MARKER, effect.opponent, this);
                }
            });
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) && effect.target.getPokemonCard() === this) {
            if (this.marker.hasMarker(this.AGILITY_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.AGILITY_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.AGILITY_MARKER, effect.player, this);
            this.marker.removeMarker(this.AGILITY_MARKER, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DELTA_CHARGE_MARKER, this);
        return state;
    }
}
exports.Dragonite = Dragonite;
