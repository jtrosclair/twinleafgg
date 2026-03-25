"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bibarel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class Bibarel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bidoof';
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Amnesia',
                cost: [C, C, C],
                damage: 40,
                text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
            },
            {
                name: 'Tumbling Tackle',
                cost: [C, C, C, C],
                damage: 60,
                text: 'Both this Pokémon and the Defending Pokémon are now Asleep.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '107';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bibarel';
        this.fullName = 'Bibarel DRX';
        this.amnesiaAttack = null;
    }
    reduceEffect(store, state, effect) {
        // Amnesia
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], { allowCancel: false }), result => {
                if (!result) {
                    return state;
                }
                this.amnesiaAttack = result;
                opponent.active.marker.addMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
                store.log(state, game_1.GameLog.LOG_PLAYER_DISABLES_ATTACK, {
                    name: player.name,
                    attack: this.amnesiaAttack.name
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect
            && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)
            && effect.attack === this.amnesiaAttack) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            effect.player.active.marker.removeMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            this.amnesiaAttack = null;
        }
        // Tumbling Tackle - both Pokemon asleep
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
            (0, prefabs_2.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
        }
        return state;
    }
}
exports.Bibarel = Bibarel;
