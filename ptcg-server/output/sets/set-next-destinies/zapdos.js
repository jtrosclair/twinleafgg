"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Zapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Thunder Claw',
                cost: [L, C],
                damage: 30,
                text: 'Flip a coin. If heads, this attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Random Spark',
                cost: [L, L, C],
                damage: 50,
                text: 'This attack does 50 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zapdos';
        this.fullName = 'Zapdos NXD';
    }
    reduceEffect(store, state, effect) {
        // Thunder Claw - flip for benched damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benchedPokemon = opponent.bench.filter(b => b.cards.length > 0);
            if (benchedPokemon.length > 0) {
                return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (result) {
                        return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                            if (targets && targets.length > 0) {
                                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                                damageEffect.target = targets[0];
                                store.reduceEffect(state, damageEffect);
                            }
                        });
                    }
                });
            }
        }
        // Random Spark - 50 damage to chosen benched Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benchedPokemon = opponent.bench.filter(b => b.cards.length > 0);
            if (benchedPokemon.length > 0) {
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                    if (targets && targets.length > 0) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                        damageEffect.target = targets[0];
                        store.reduceEffect(state, damageEffect);
                    }
                });
            }
        }
        return state;
    }
}
exports.Zapdos = Zapdos;
