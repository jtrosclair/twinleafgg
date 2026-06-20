"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seaking = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Seaking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Goldeen';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hydro Jet',
                cost: [C, C, C],
                damage: 0,
                text: 'This attack does 30 damage for each [W] Energy attached to this Pokémon to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
            }];
        this.set = 'M5';
        this.setNumber = '13';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Seaking';
        this.fullName = 'Seaking M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-astral-radiance/beedrill-v.ts (Swarming Sting — DealDamageEffect vs bench PutDamageEffect)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkEnergy);
            let waterUnits = 0;
            checkEnergy.energyMap.forEach(em => {
                waterUnits += em.provides.filter(t => t === card_types_1.CardType.WATER || t === card_types_1.CardType.ANY || t === card_types_1.CardType.WLFM || t === card_types_1.CardType.GRW).length;
            });
            const totalDamage = 30 * waterUnits;
            if (totalDamage <= 0) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const pick = targets[0];
                const dmg = pick === opponent.active
                    ? new attack_effects_1.DealDamageEffect(effect, totalDamage)
                    : new attack_effects_1.PutDamageEffect(effect, totalDamage);
                dmg.target = pick;
                store.reduceEffect(state, dmg);
            });
        }
        return state;
    }
}
exports.Seaking = Seaking;
