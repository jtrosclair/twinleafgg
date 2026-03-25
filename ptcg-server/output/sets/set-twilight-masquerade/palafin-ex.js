"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palafinex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Palafinex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Finizen';
        this.cardType = W;
        this.hp = 340;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.powers = [{
                name: 'Hero\'s Spirit',
                powerType: game_1.PowerType.ABILITY,
                text: 'Put this Pokémon into play only with the effect of Palafin\'s Zero to Hero Ability.'
            }];
        this.attacks = [{
                name: 'Giga Impact',
                cost: [W],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'TWM';
        this.setNumber = '61';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Palafin ex TWM';
        this.name = 'Palafin ex';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_EVOLVE);
            }
        }
        // Giga Impact
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Palafinex = Palafinex;
