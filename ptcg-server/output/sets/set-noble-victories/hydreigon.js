"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Hydreigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.cardType = D;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Dark Aura',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Each basic Energy attached to your Pokémon provides [D] Energy instead of its usual type.'
            }];
        this.attacks = [{
                name: 'Berserker Blade',
                cost: [D, D, C, C],
                damage: 60,
                text: 'Does 40 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'NVI';
        this.setNumber = '79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hydreigon';
        this.fullName = 'Hydreigon NVI';
    }
    reduceEffect(store, state, effect) {
        // Dark Aura - convert all basic energy to Dark
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            const player = effect.player;
            // Check if this Hydreigon is in play for this player
            let hydreigonInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    hydreigonInPlay = true;
                }
            });
            if (!hydreigonInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Only affect player's own Pokémon
            let sourceOwner = null;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === effect.source) {
                    sourceOwner = player;
                }
            });
            if (sourceOwner !== player) {
                return state;
            }
            // Convert all basic energy to provide Dark
            effect.energyMap.forEach(em => {
                if (em.card.energyType === card_types_1.EnergyType.BASIC) {
                    em.provides = em.provides.map(() => card_types_1.CardType.DARK);
                }
            });
        }
        // Berserker Blade - damage 2 benched Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    targets.forEach(target => {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 40);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    });
                }
            });
        }
        return state;
    }
}
exports.Hydreigon = Hydreigon;
