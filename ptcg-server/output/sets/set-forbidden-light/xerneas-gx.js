"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XerneasGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class XerneasGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 180;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Overrun',
                cost: [C],
                damage: 20,
                text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Aurora Horns',
                cost: [Y, Y, C],
                damage: 120,
                text: ''
            },
            {
                name: 'Sanctuary-GX',
                cost: [Y, Y, C],
                damage: 0,
                gxAttack: true,
                text: 'Move all damage counters from each of your Pokémon to your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'FLI';
        this.name = 'Xerneas-GX';
        this.fullName = 'Xerneas-GX FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
    }
    reduceEffect(store, state, effect) {
        // Overrun
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
        }
        // Sanctuary-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() + opponent.getPrizeLeft() > 6) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            // Check if player has used GX attack
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            // set GX attack as used for game
            player.usedGX = true;
            let damageCounters = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                damageCounters += card.damage;
                card.damage = 0;
            });
            opponent.active.damage += damageCounters;
        }
        return state;
    }
}
exports.XerneasGX = XerneasGX;
