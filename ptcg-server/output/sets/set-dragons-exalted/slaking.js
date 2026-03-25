"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slaking = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Slaking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vigoroth';
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Unobservant',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent\'s Active Pokemon is a Basic Pokemon, this Pokemon can\'t attack.'
            }];
        this.attacks = [
            {
                name: 'Crushing Blow',
                cost: [C, C, C, C],
                damage: 100,
                text: 'Discard an Energy attached to the Defending Pokemon.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '103';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slaking';
        this.fullName = 'Slaking DRX';
    }
    reduceEffect(store, state, effect) {
        // Ability: Unobservant - Can't attack if opponent's active is Basic
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                const opponentActive = opponent.active.getPokemonCard();
                if (opponentActive && opponentActive.stage === card_types_1.Stage.BASIC) {
                    throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
        }
        // Attack: Crushing Blow - Discard an Energy from Defending Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
        }
        return state;
    }
}
exports.Slaking = Slaking;
