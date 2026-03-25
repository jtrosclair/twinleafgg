"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Audino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Powerful Slap',
                cost: [C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 40 damage times the number of heads.'
            },
            {
                name: 'Heal Pulse',
                cost: [C, C, C],
                damage: 0,
                text: 'Heal 50 damage from 1 of your Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Audino';
        this.fullName = 'Audino EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkEnergy);
            let energyCount = 0;
            checkEnergy.energyMap.forEach(em => {
                energyCount += em.provides.length;
            });
            if (energyCount === 0) {
                effect.damage = 0;
                return state;
            }
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, energyCount, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 40 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const target = targets[0];
                    target.damage = Math.max(0, target.damage - 50);
                }
            });
        }
        return state;
    }
}
exports.Audino = Audino;
