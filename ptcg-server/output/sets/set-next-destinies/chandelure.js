"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chandelure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Chandelure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lampent';
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Flame Burst',
                cost: [R],
                damage: 30,
                text: 'Does 30 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Inferno',
                cost: [R, C],
                damage: 80,
                text: 'Discard all Energy attached to this Pokémon. The Defending Pokémon is now Burned.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '20';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Chandelure';
        this.fullName = 'Chandelure NXD';
    }
    reduceEffect(store, state, effect) {
        // Flame Burst - 30 damage to active, 30 to 2 benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Get benched Pokémon
            const benchedPokemon = opponent.bench.filter(b => b.cards.length > 0);
            if (benchedPokemon.length === 0) {
                return state;
            }
            // If only 1 or 2 benched, damage all of them
            if (benchedPokemon.length <= 2) {
                benchedPokemon.forEach(target => {
                    const damageEffect = new attack_effects_2.PutDamageEffect(effect, 30);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            }
            // Otherwise, prompt player to choose 2
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 2, max: 2, allowCancel: false }), (selected) => {
                if (selected && selected.length > 0) {
                    selected.forEach(target => {
                        const damageEffect = new attack_effects_2.PutDamageEffect(effect, 30);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    });
                }
            });
        }
        // Inferno - discard all energy and burn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Discard all energy
            const energyCards = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            if (energyCards.length > 0) {
                const discardEffect = new attack_effects_2.DiscardCardsEffect(effect, energyCards);
                store.reduceEffect(state, discardEffect);
            }
            // Burn the defender
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
        }
        return state;
    }
}
exports.Chandelure = Chandelure;
