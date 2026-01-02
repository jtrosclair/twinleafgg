"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotomex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
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
                text: 'Your Pokemon with "Rotom" in their name may have up to 2 Pokemon Tool cards attached to them. (If this Pokemon loses this Ability, discard Pokemon Tools from your Pokemon until only 1 remains.)'
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
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Multi Adapter: Set maxTools to 2 for any Pokemon with "Rotom" in their name
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card && card.name.includes('Rotom')) {
                    card.maxTools = 2;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
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
