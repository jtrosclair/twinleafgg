"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowbro = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Slowbro extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Airhead',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have 2, 4, or 6 Prize Cards left, this Pokémon can\'t attack.'
            }];
        this.attacks = [{
                name: 'Lazy Headbutt',
                cost: [W, C],
                damage: 80,
                text: 'This Pokémon is now Asleep.'
            }];
        this.set = 'DEX';
        this.setNumber = '24';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slowbro';
        this.fullName = 'Slowbro DEX';
    }
    reduceEffect(store, state, effect) {
        // Airhead - prevent attacking if 2, 4, or 6 Prize cards left
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const prizesLeft = player.getPrizeLeft();
            // Check if ability is blocked
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                // Ability is blocked, proceed with attack
                return state;
            }
            // If player has 2, 4, or 6 prizes left, can't attack
            if (prizesLeft === 2 || prizesLeft === 4 || prizesLeft === 6) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Lazy Headbutt - puts self to sleep
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const selfAsleep = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            selfAsleep.target = player.active;
            store.reduceEffect(state, selfAsleep);
        }
        return state;
    }
}
exports.Slowbro = Slowbro;
