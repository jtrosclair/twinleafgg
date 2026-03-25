"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shuppet = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shuppet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: C, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Disable',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
            },
            {
                name: 'Haunt',
                cost: [P],
                damage: 0,
                text: 'Put 1 damage counter on the Defending Pokémon.'
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Shuppet';
        this.fullName = 'Shuppet TM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    return state;
                }
                const opponent = game_1.StateUtils.getOpponent(state, player);
                const pokemonCard = opponent.active.getPokemonCard();
                if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
                    return state;
                }
                store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], { allowCancel: false }), result => {
                    result;
                    if (!result) {
                        return state;
                    }
                    this.MEMORY_SKIPPED_ATTACK = result;
                    store.log(state, game_1.GameLog.LOG_PLAYER_DISABLES_ATTACK, {
                        name: player.name,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        attack: this.MEMORY_SKIPPED_ATTACK.name
                    });
                    opponent.active.marker.addMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
                    return state;
                });
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            if (effect.attack === this.MEMORY_SKIPPED_ATTACK) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            this.MEMORY_SKIPPED_ATTACK = undefined;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON)(1, store, state, effect);
        }
        return state;
    }
}
exports.Shuppet = Shuppet;
