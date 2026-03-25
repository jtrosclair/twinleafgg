"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machamp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Machamp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Machoke';
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Badge of Discipline',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'The damage of each of your Fighting Pokémon\'s attacks isn\'t affected by Resistance.'
            }];
        this.attacks = [
            {
                name: 'Close Combat',
                cost: [F, C, C, C],
                damage: 120,
                text: 'Flip a coin. If tails, during your opponent\'s next turn, any damage done to this Pokémon by attacks is increased by 30 (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Machamp';
        this.fullName = 'Machamp PLB';
        this.CLOSE_COMBAT_MARKER = 'CLOSE_COMBAT_MARKER';
        this.CLEAR_CLOSE_COMBAT_MARKER = 'CLEAR_CLOSE_COMBAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Ability: Badge of Discipline - passive, intercept AttackEffect
        if (effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            // Check if attacker is a Fighting Pokemon
            const attackerCard = player.active.getPokemonCard();
            if (attackerCard && attackerCard.cardType === card_types_1.CardType.FIGHTING) {
                // Check if this Machamp is in play on the same side
                let machampInPlay = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.getPokemonCard() === this) {
                        machampInPlay = true;
                    }
                });
                if (machampInPlay && !(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                    effect.ignoreResistance = true;
                }
            }
        }
        // Attack: Close Combat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    // Tails: take 30 more damage during opponent's next turn
                    player.active.marker.addMarker(this.CLOSE_COMBAT_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_CLOSE_COMBAT_MARKER, this);
                }
            });
        }
        // Intercept incoming damage for Close Combat penalty
        // Ref: set-base-set/pluspower.ts (AfterWeaknessAndResistance timing via post-W/R hook)
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(this.CLOSE_COMBAT_MARKER, this)) {
            const targetOwner = game_1.StateUtils.findOwner(state, effect.target);
            if (state.phase === game_1.GamePhase.ATTACK && effect.player !== targetOwner) {
                effect.damage += 30;
            }
        }
        // Cleanup Close Combat marker
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_CLOSE_COMBAT_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_CLOSE_COMBAT_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.CLOSE_COMBAT_MARKER, this);
            });
        }
        return state;
    }
}
exports.Machamp = Machamp;
