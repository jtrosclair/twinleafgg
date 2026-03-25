"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Masquerain = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Masquerain extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Surskit';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Tool Reversal',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), you may put a Pokémon Tool card attached to 1 of your Pokémon into your hand.'
            }];
        this.attacks = [
            {
                name: 'Bug Bite',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Masquerain';
        this.fullName = 'Masquerain PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            // Check if any of your Pokemon have a tool attached
            let hasToolAttached = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.tools.length > 0) {
                    hasToolAttached = true;
                }
            });
            if (!hasToolAttached) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: true }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const target = targets[0];
                if (target.tools.length > 0) {
                    const tool = target.tools[0];
                    target.moveCardTo(tool, player.hand);
                }
            });
        }
        return state;
    }
}
exports.Masquerain = Masquerain;
