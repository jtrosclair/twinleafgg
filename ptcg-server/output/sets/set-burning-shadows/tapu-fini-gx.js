"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuFiniGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class TapuFiniGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 170;
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Aqua Ring',
                cost: [C],
                damage: 20,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Hydro Shot',
                cost: [W, W, C],
                damage: 0,
                text: 'Discard 2 [W] Energy from this Pokémon. This attack does 120 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Tapu Storm-GX',
                cost: [W],
                damage: 0,
                gxAttack: true,
                text: 'Shuffle your opponent\'s Active Pokémon and all cards attached to it into their deck. If your opponent has no Benched Pokémon, this attack does nothing. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'BUS';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tapu Fini-GX';
        this.fullName = 'Tapu Fini-GX BUS';
    }
    reduceEffect(store, state, effect) {
        // Aqua Ring
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            let targets = [];
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
                targets = results || [];
                if (targets.length > 0) {
                    player.active.clearEffects();
                    player.switchPokemon(targets[0]);
                }
            });
        }
        // Hydro Shot
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, checkProvidedEnergy.energyMap, [W, W], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                    const targets = selected || [];
                    (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 120, targets);
                });
            });
        }
        // Tapu Storm-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            // set GX attack as used for game
            player.usedGX = true;
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            opponent.active.clearEffects();
            opponent.active.damage = 0;
            opponent.active.moveTo(opponent.deck);
            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
        }
        return state;
    }
}
exports.TapuFiniGX = TapuFiniGX;
