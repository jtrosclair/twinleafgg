"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiningLugia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ShiningLugia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Argent Wing',
                cost: [C, C, C],
                damage: 60,
                text: 'If your opponent\'s Active Pokémon has an Ability, this attack does 60 more damage.'
            }, {
                name: 'Aero Force',
                cost: [C, C, C, C],
                damage: 130,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'SMP';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shining Lugia';
        this.fullName = 'Shining Lugia SMP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const target = opponent.active.getPokemonCard();
            if (target !== undefined && target.powers.length > 0)
                if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, target))
                    effect.damage += 60;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [C], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.ShiningLugia = ShiningLugia;
