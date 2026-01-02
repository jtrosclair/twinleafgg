"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsMoltresex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TeamRocketsMoltresex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = R;
        this.hp = 220;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Flame Screen',
                cost: [R, C, C],
                damage: 110,
                text: 'During your opponent\'s next turn, this Pokémon takes 50 less damage from attacks (after applying Weakness and Resistance).'
            },
            {
                name: 'Evil Burn',
                cost: [R, C, C, C],
                damage: 0,
                text: 'Discard a Team Rocket\'s Energy from this Pokémon. If you do, discard your opponent\'s Active Pokémon and all attached cards.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Moltres ex';
        this.fullName = 'Team Rocket\'s Moltres ex DRI';
        this.FLAME_SCREEN_MARKER = 'FLAME_SCREEN_MARKER';
        this.CLEAR_FLAME_SCREEN_MARKER = 'CLEAR_FLAME_SCREEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Flame Screen
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            player.active.marker.addMarker(this.FLAME_SCREEN_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_FLAME_SCREEN_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_FLAME_SCREEN_MARKER, this)) {
            const opponent = effect.player;
            const player = game_1.StateUtils.getOpponent(state, opponent);
            opponent.marker.removeMarker(this.CLEAR_FLAME_SCREEN_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card.getPokemonCard() === this) {
                    card.marker.removeMarker(this.FLAME_SCREEN_MARKER, this);
                }
            });
        }
        // Evil Burn
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (!player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.name === 'Team Rocket Energy')) {
                return state;
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGY_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL, name: 'Team Rocket Energy' }, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                player.active.moveCardsTo(cards, player.discard);
                opponent.active.clearEffects();
                prefabs_1.MOVE_CARDS(store, state, opponent.active, opponent.discard);
            });
        }
        return state;
    }
}
exports.TeamRocketsMoltresex = TeamRocketsMoltresex;
