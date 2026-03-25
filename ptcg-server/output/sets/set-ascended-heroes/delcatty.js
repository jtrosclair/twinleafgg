"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delcatty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Delcatty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cat Kick',
                cost: [C],
                damage: 40,
                text: ''
            }, {
                name: 'Energy Crush',
                cost: [C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each Energy attached to all of your opponent\'s Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '166';
        this.name = 'Delcatty';
        this.fullName = 'Delcatty ASC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += energy.provides.length;
                });
            });
            effect.damage = energies * 40;
        }
        return state;
    }
}
exports.Delcatty = Delcatty;
