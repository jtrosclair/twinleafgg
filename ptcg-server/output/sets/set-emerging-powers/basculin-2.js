"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basculin2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Basculin2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Splatter',
                cost: [W, C],
                damage: 0,
                text: 'Does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Basculin';
        this.fullName = 'Basculin EPO 25';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                const target = targets[0];
                const putDamage = new attack_effects_1.PutDamageEffect(effect, 30);
                putDamage.target = target;
                store.reduceEffect(state, putDamage);
            });
        }
        return state;
    }
}
exports.Basculin2 = Basculin2;
