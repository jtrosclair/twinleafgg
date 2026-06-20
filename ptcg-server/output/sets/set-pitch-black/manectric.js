"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manectric = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Manectric extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Electrike';
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.FLASH_BARRIER_MARKER = 'M5_MANECTRIC_FLASH_BARRIER';
        this.CLEAR_FLASH_BARRIER_MARKER = 'M5_MANECTRIC_CLEAR_FLASH';
        this.attacks = [{
                name: 'Flash Barrier',
                cost: [L, L],
                damage: 50,
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from your opponent\'s Evolution Pokémon.',
            },
            {
                name: 'Sonic Edge',
                cost: [L, L, L],
                damage: 110,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by effects on your opponent\'s Active Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '23';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Manectric';
        this.fullName = 'Manectric M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-astral-radiance/glaceon.ts (Frost Wall)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.FLASH_BARRIER_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_FLASH_BARRIER_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_2.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 110);
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect)
            && effect.target.marker.hasMarker(this.FLASH_BARRIER_MARKER, this)) {
            const atk = effect.source.getPokemonCard();
            if (atk && atk.stage !== card_types_1.Stage.BASIC) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_FLASH_BARRIER_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_FLASH_BARRIER_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                cardList.marker.removeMarker(this.FLASH_BARRIER_MARKER, this);
            });
        }
        return state;
    }
}
exports.Manectric = Manectric;
