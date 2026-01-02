"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mismagius = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Mismagius extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Misdreavus';
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Assassin Magic',
                cost: [P, C],
                damage: 60,
                text: 'If your opponent\'s Active Pokémon is affected by a Special Condition, place 6 damage counters on 1 of your opponent\'s Benched Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Mismagius';
        this.fullName = 'Mismagius M2a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent's active Pokemon has any special conditions
            if (opponent.active.specialConditions.length > 0) {
                // Check if opponent has benched Pokemon
                const benchedPokemon = opponent.bench.filter(b => b.cards.length > 0);
                if (benchedPokemon.length > 0) {
                    // Prompt player to choose a benched Pokemon to damage
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), (selected) => {
                        if (selected && selected.length > 0) {
                            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, 60);
                            putCountersEffect.target = selected[0];
                            store.reduceEffect(state, putCountersEffect);
                        }
                    });
                }
            }
        }
        return state;
    }
}
exports.Mismagius = Mismagius;
