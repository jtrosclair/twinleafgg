"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu51 = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #51 — Lightning Crash */
class Pikachu51 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Lightning Crash',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING],
                damage: 0,
                text: 'Discard all [L] Energy from this Pokémon, and this attack does 90 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 51';
    }
    reduceEffect(store, state, effect) {
        // Lightning Crash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const providedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, providedEnergy);
            const cards = [...new Set(providedEnergy.energyMap
                    .filter(energy => energy.card instanceof game_1.EnergyCard
                    && energy.provides.some(type => [game_1.CardType.LIGHTNING, game_1.CardType.ANY, game_1.CardType.WLFM, game_1.CardType.LPM].includes(type)))
                    .map(energy => energy.card))];
            cards.forEach(c => { (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.discard, { cards: [c], sourceCard: this }); });
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(90, effect, store, state);
        }
        return state;
    }
}
exports.Pikachu51 = Pikachu51;
