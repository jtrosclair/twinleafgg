"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salamence = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
class Salamence extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Shelgon';
        this.cardType = N;
        this.hp = 150;
        this.weakness = [{ type: N }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Breakwing',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may discard all Pokémon Tool cards attached to each of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Gaia Crush',
                cost: [R, W, C, C],
                damage: 100,
                text: 'Discard any Stadium card in play.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Salamence';
        this.fullName = 'Salamence PLB';
    }
    reduceEffect(store, state, effect) {
        // Ability: Breakwing - when evolved, discard all opponent's tools
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent has any tools attached
            let hasTools = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.tools.length > 0) {
                    hasTools = true;
                }
            });
            if (!hasTools) {
                return state;
            }
            store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), result => {
                if (!result) {
                    return;
                }
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    const tools = cardList.tools.slice();
                    tools.forEach(tool => {
                        cardList.moveCardTo(tool, opponent.discard);
                    });
                });
            });
        }
        // Attack: Gaia Crush
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DISCARD_A_STADIUM_CARD_IN_PLAY)(state);
        }
        return state;
    }
}
exports.Salamence = Salamence;
