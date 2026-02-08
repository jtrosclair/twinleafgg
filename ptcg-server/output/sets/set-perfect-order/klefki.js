"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klefki = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
class Klefki extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Memory Lock',
                cost: [M],
                damage: 30,
                text: 'Choose an attack on your opponent\'s Active Pokemon. During your opponent\'s next turn, the Defending Pokemon can\'t use that attack.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Klefki';
        this.fullName = 'Klefki M3';
    }
    reduceEffect(store, state, effect) {
        // Memory Lock - choose attack to prevent
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
                return state;
            }
            store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], { allowCancel: false }), result => {
                if (!result) {
                    return state;
                }
                this.MEMORY_LOCKED_ATTACK = result;
                store.log(state, game_1.GameLog.LOG_PLAYER_DISABLES_ATTACK, {
                    name: player.name,
                    attack: this.MEMORY_LOCKED_ATTACK.name
                });
                opponent.active.marker.addMarker(pokemon_card_list_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            });
        }
        // Prevent the locked attack
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(pokemon_card_list_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            if (effect.attack === this.MEMORY_LOCKED_ATTACK) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Clear marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(pokemon_card_list_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(pokemon_card_list_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            this.MEMORY_LOCKED_ATTACK = undefined;
        }
        return state;
    }
}
exports.Klefki = Klefki;
