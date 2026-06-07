"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Laprasex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Laprasex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 210;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Hydro Turn',
                cost: [W],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each [W] Energy attached to this Pokémon. Switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Surf',
                cost: [W, W, W],
                damage: 140,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'POR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.usSetNumber = 'POR 22';
        this.name = 'Lapras ex';
        this.fullName = 'Lapras ex POR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() === this) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkProvidedEnergy);
                    const waterEnergyCount = checkProvidedEnergy.energyMap.reduce((sum, em) => sum + em.provides.filter(t => t === game_1.CardType.WATER || t === game_1.CardType.ANY).length, 0);
                    effect.damage = waterEnergyCount * 30;
                }
            });
            return state;
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            return state;
        }
        return state;
    }
}
exports.Laprasex = Laprasex;
