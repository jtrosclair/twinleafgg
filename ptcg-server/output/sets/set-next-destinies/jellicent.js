"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jellicent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Jellicent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Frillish';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Vengeful Wish',
                cost: [C],
                damage: 0,
                text: 'If this Pokémon was damaged by an attack during your opponent\'s last turn, this attack does the same amount of damage done to the Defending Pokémon.'
            },
            {
                name: 'Absorb Life',
                cost: [W, W, C],
                damage: 30,
                text: 'Heal 30 damage from this Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '35';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jellicent';
        this.fullName = 'Jellicent NXD';
        this.DAMAGE_RECEIVED_MARKER = 'DAMAGE_RECEIVED_MARKER';
        this.lastDamageReceived = 0;
    }
    reduceEffect(store, state, effect) {
        // Track damage received during opponent's attack
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            // Only track if damaged by opponent during attack phase
            if (effect.damage > 0 && player !== targetPlayer && state.phase === game_1.GamePhase.ATTACK) {
                this.lastDamageReceived = effect.damage;
                targetPlayer.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.cards.includes(this)) {
                        (0, prefabs_1.ADD_MARKER)(this.DAMAGE_RECEIVED_MARKER, cardList, this);
                    }
                });
            }
        }
        // Vengeful Wish - deal same damage back
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.cards.includes(this) && (0, prefabs_1.HAS_MARKER)(this.DAMAGE_RECEIVED_MARKER, cardList, this)) {
                    if (this.lastDamageReceived > 0) {
                        const putDamageEffect = new attack_effects_2.PutDamageEffect(effect, this.lastDamageReceived);
                        putDamageEffect.target = opponent.active;
                        store.reduceEffect(state, putDamageEffect);
                    }
                }
            });
        }
        // Absorb Life - heal 30 damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
        }
        // Clear marker at end of turn (marker lasts one turn cycle)
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.cards.includes(this)) {
                    (0, prefabs_1.REMOVE_MARKER)(this.DAMAGE_RECEIVED_MARKER, cardList, this);
                    this.lastDamageReceived = 0;
                }
            });
        }
        return state;
    }
}
exports.Jellicent = Jellicent;
