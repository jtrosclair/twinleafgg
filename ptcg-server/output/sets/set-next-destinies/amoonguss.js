"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amoonguss = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
class Amoonguss extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Foongus';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Sporprise',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may use this Ability. If you do, your opponent\'s Active Pokémon is now Confused and Poisoned.'
            }];
        this.attacks = [{
                name: 'Rising Lunge',
                cost: [G, C],
                damage: 20,
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }];
        this.set = 'NXD';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Amoonguss';
        this.fullName = 'Amoonguss NXD';
    }
    reduceEffect(store, state, effect) {
        // Sporprise - when evolved, may confuse and poison opponent's active
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Prompt player to use ability
            state = store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
                }
            });
            return state;
        }
        // Rising Lunge - flip for more damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    effect.damage += 30;
                }
            });
        }
        return state;
    }
}
exports.Amoonguss = Amoonguss;
