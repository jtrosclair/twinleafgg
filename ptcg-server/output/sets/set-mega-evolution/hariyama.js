"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hariyama = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hariyama extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Makuhita';
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Sumo Catcher',
                powerType: game_2.PowerType.ABILITY,
                text: 'Once during your turn, when you play this card from your hand to evolve one of your Pokémon, you may switch one of your opponent\'s Benched Pokémon with their Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Wild Press',
                cost: [F, F, F],
                damage: 210,
                text: 'This Pokémon does 70 damage to itself.'
            },];
        this.set = 'MEG';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hariyama';
        this.fullName = 'Hariyama M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this) && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, (result) => {
                if (result) {
                    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        const switchEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, cardList);
                        store.reduceEffect(state, switchEffect);
                        if (switchEffect.target) {
                            opponent.switchPokemon(cardList);
                        }
                    });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 70);
        }
        return state;
    }
}
exports.Hariyama = Hariyama;
