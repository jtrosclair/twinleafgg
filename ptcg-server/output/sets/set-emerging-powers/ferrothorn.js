"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ferrothorn = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Ferrothorn extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ferroseed';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Steel Feelers',
                cost: [M],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Gyro Ball',
                cost: [M, C, C],
                damage: 60,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon. Then, your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Ferrothorn';
        this.fullName = 'Ferrothorn EPO';
        this.usedGyroBall = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 30 * heads;
            });
        }
        // Gyro Ball - set flag when attack is used
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedGyroBall = true;
        }
        // Gyro Ball - switch both Pokémon after damage is dealt
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedGyroBall) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerHasBench = player.bench.some(b => b.cards.length > 0);
            const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
            if (playerHasBench) {
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), playerResult => {
                    const playerTarget = playerResult[0];
                    player.switchPokemon(playerTarget);
                    if (opponentHasBench) {
                        return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), opponentResult => {
                            const opponentTarget = opponentResult[0];
                            opponent.switchPokemon(opponentTarget);
                        });
                    }
                });
            }
            else if (opponentHasBench) {
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), opponentResult => {
                    const opponentTarget = opponentResult[0];
                    opponent.switchPokemon(opponentTarget);
                });
            }
        }
        // Clean up Gyro Ball flag at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedGyroBall) {
            this.usedGyroBall = false;
        }
        return state;
    }
}
exports.Ferrothorn = Ferrothorn;
