"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanSandslash = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AlolanSandslash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Alolan Sandshrew';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.SPIKE_ARMOR_MARKER = 'ALOLAN_SANDSLASH_UPR_SPIKE_ARMOR_MARKER';
        this.CLEAR_SPIKE_ARMOR_MARKER = 'ALOLAN_SANDSLASH_UPR_CLEAR_SPIKE_ARMOR_MARKER';
        this.attacks = [
            {
                name: 'Spike Armor',
                cost: [],
                damage: 30,
                text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if this Pokémon is Knocked Out), put 6 damage counters on the Attacking Pokémon.'
            },
            {
                name: 'Frost Breath',
                cost: [W, C, C],
                damage: 90,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Alolan Sandslash';
        this.fullName = 'Alolan Sandslash UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Spike Armor
        // Ref: set-breakpoint/sigilyph.ts (Reflective Shield - AfterDamageEffect with counter damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.SPIKE_ARMOR_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_SPIKE_ARMOR_MARKER, this);
        }
        // Put 6 damage counters (60 damage) on attacker when this Pokemon is damaged
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)
            && effect.target.getPokemonCard() === this) {
            if (effect.target.marker.hasMarker(this.SPIKE_ARMOR_MARKER, this)) {
                const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
                const attackingPlayer = effect.player;
                if (effect.damage > 0 && attackingPlayer !== targetPlayer
                    && targetPlayer.active === effect.target
                    && state.phase === game_1.GamePhase.ATTACK) {
                    effect.source.damage += 60;
                }
            }
        }
        // Clean up marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_SPIKE_ARMOR_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_SPIKE_ARMOR_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                cardList.marker.removeMarker(this.SPIKE_ARMOR_MARKER, this);
            });
        }
        return state;
    }
}
exports.AlolanSandslash = AlolanSandslash;
