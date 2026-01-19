"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysPoliwag = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MistysPoliwag extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.MISTYS];
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bubbles',
                cost: [W],
                damage: 20,
                text: 'Flip a coin. If tails, you can\'t use this attack during your next turn.'
            },
            {
                name: 'Amnesia',
                cost: [W, W],
                damage: 0,
                text: 'Choose 1 of the Defending Pokémon\'s attacks.That Pokémon can\'t use that attack during your opponent\'s next turn.'
            }];
        this.set = 'G2';
        this.name = 'Misty\'s Poliwag';
        this.fullName = 'Misty\'s Poliwag G2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.BLOCK_EFFECT_IF_MARKER)(this.ATTACK_USED_2_MARKER, effect.player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    (0, prefabs_1.ADD_MARKER)(this.ATTACK_USED_MARKER, effect.player, this);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.ATTACK_USED_2_MARKER, this);
        (0, prefabs_1.REPLACE_MARKER_AT_END_OF_TURN)(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard === undefined || pokemonCard.attacks.length === 0 || pokemonCard.stage !== card_types_1.Stage.BASIC) {
                return state;
            }
            store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], { allowCancel: false }), result => {
                result;
                if (!result) {
                    return state;
                }
                this.DISABLED_ATTACK = result;
                store.log(state, game_1.GameLog.LOG_PLAYER_DISABLES_ATTACK, {
                    name: player.name,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    attack: this.DISABLED_ATTACK.name
                });
                opponent.active.marker.addMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            if (effect.attack === this.DISABLED_ATTACK) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            this.DISABLED_ATTACK = undefined;
        }
        return state;
    }
}
exports.MistysPoliwag = MistysPoliwag;
