"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manectric = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Manectric extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Electrike';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Energy Crush',
                cost: [L],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the amount of Energy attached to all of your opponent\'s Pokémon.'
            },
            {
                name: 'Flash Impact',
                cost: [L, C, C],
                damage: 80,
                text: 'Does 20 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '43';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Manectric';
        this.fullName = 'Manectric DRX';
    }
    reduceEffect(store, state, effect) {
        // Energy Crush
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const totalEnergy = (0, prefabs_1.GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON)(opponent, store, state);
            effect.damage = 20 * totalEnergy;
        }
        // Flash Impact - does 20 damage to 1 of your own Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
        }
        return state;
    }
}
exports.Manectric = Manectric;
