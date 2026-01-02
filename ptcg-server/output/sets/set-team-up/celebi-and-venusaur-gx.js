"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CelebiVenusaurGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class CelebiVenusaurGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 270;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Pollen Hazard',
                cost: [G, C, C],
                damage: 50,
                text: 'Your opponent\'s Active Pokémon is now Burned, Confused, and Poisoned.'
            },
            {
                name: 'Solar Beam',
                cost: [G, G, C, C],
                damage: 150,
                text: ''
            },
            {
                name: 'Evergreen-GX',
                cost: [G, G, C, C],
                damage: 180,
                gxAttack: true,
                text: 'Heal all damage from this Pokémon. If this Pokémon has at least 1 extra [G] Energy attached to it (in addition to this attack\'s cost), shuffle all cards from your discard pile into your deck. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'TEU';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Celebi & Venusaur-GX';
        this.fullName = 'Celebi & Venusaur-GX TEU';
    }
    reduceEffect(store, state, effect) {
        // Pollen Hazard
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        // Evergreen-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 2, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            const healing = new game_effects_1.HealEffect(player, player.active, player.active.damage);
            healing.target = player.active;
            store.reduceEffect(state, healing);
            const extraEffectCost = [G, G, G, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                player.discard.moveTo(player.deck);
                prefabs_1.SHUFFLE_DECK(store, state, player);
            }
        }
        return state;
    }
}
exports.CelebiVenusaurGX = CelebiVenusaurGX;
