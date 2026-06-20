"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vikavolt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const bolty_lightning_energy_1 = require("./bolty-lightning-energy");
class Vikavolt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charjabug';
        this.cardType = L;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Quick Dive',
                cost: [L],
                damage: 0,
                text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
            },
            {
                name: 'Giga Electromagnetic Blaster',
                cost: [L, L],
                damage: 260,
                text: 'If this Pokémon doesn\'t have any Bolty [L] Energy attached, this attack does nothing.',
            }];
        this.set = 'M5';
        this.setNumber = '25';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vikavolt';
        this.fullName = 'Vikavolt M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), picked => {
                if (!picked || picked.length === 0) {
                    return;
                }
                const t = picked[0];
                const dmg = t === opponent.active
                    ? new attack_effects_1.DealDamageEffect(effect, 50)
                    : new attack_effects_1.PutDamageEffect(effect, 50);
                dmg.target = t;
                store.reduceEffect(state, dmg);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const hasBolty = effect.player.active.cards.some(c => c instanceof bolty_lightning_energy_1.BoltyLightningEnergy || c.name === 'Bolty [L] Energy');
            if (!hasBolty) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Vikavolt = Vikavolt;
