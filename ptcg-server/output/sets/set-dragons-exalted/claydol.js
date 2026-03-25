"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claydol = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Claydol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Baltoy';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Rapid Spin',
                cost: [C, C],
                damage: 30,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon. Then, your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            },
            {
                name: 'Rock Smash',
                cost: [F, C, C],
                damage: 60,
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Claydol';
        this.fullName = 'Claydol DRX';
        this.usedRapidSpin = false;
    }
    reduceEffect(store, state, effect) {
        // Rapid Spin - switch both after damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedRapidSpin = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedRapidSpin) {
            this.usedRapidSpin = false;
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
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedRapidSpin) {
            this.usedRapidSpin = false;
        }
        // Rock Smash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Claydol = Claydol;
