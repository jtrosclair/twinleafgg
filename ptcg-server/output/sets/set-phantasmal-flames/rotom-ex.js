"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotomex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rotomex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = L;
        this.hp = 190;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Multi Adapter',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Pokémon that has "Rotom" in its name may have up to 2 Pokémon Tool cards attached. If this Ability goes away, discard Pokémon Tools from those Pokémon until only 1 remains on each.'
            }];
        this.attacks = [{
                name: 'Thunderbolt',
                cost: [L, C],
                damage: 130,
                text: 'Discard all Energy from this Pokemon.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Rotom ex';
        this.fullName = 'Rotom ex M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect && game_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Multi Adapter: Set maxTools to 2 for any Pokemon with "Rotom" in their name
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card && card.name.includes('Rotom')) {
                    card.maxTools = 2;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Discard all Energy from this Pokemon
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            const energyCards = checkProvidedEnergy.energyMap.map(e => e.card);
            if (energyCards.length > 0) {
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, energyCards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            }
        }
        return state;
    }
}
exports.Rotomex = Rotomex;
