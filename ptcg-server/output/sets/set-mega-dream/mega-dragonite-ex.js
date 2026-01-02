"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaDragoniteex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaDragoniteex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = N;
        this.hp = 370;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Sky Transport',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may use this Ability. Switch your Active Pokémon with 1 of your Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Ryuno Glide',
                cost: [W, L, L],
                damage: 330,
                text: 'Discard 2 Energy from this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.setNumber = '126';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Dragonite ex';
        this.fullName = 'Mega Dragonite ex M2a';
        this.SKY_CARRY_MARKER = 'SKY_CARRY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Reset marker when Pokemon is played
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SKY_CARRY_MARKER, this);
        }
        // Reset marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SKY_CARRY_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.SKY_CARRY_MARKER, this);
        }
        // Sky Transport ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check if ability is blocked
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            // Check if ability was already used this turn
            if (player.marker.hasMarker(this.SKY_CARRY_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Check if player has benched Pokémon
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Switch Active with Benched Pokémon
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
            // Mark ability as used
            player.marker.addMarker(this.SKY_CARRY_MARKER, this);
            // Add visual effect
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        // Ryuno Glide attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            // Check if this Pokémon has at least 2 energy attached
            const energyCount = player.active.cards.filter(card => card.superType === game_1.SuperType.ENERGY).length;
            if (energyCount >= 2) {
                state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 2, max: 2 }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length === 0) {
                        return state;
                    }
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        source.moveCardTo(transfer.card, player.discard);
                    }
                });
            }
        }
        return state;
    }
}
exports.MegaDragoniteex = MegaDragoniteex;
