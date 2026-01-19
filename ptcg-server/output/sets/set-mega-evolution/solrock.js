"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solrock = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Solrock extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cosmo Beam',
                cost: [F],
                damage: 70,
                text: 'If you don\'t have Lunatone on your Bench, this attack does nothing. This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Solrock';
        this.fullName = 'Solrock M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
            let isLunatoneInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Lunatone') {
                    isLunatoneInPlay = true;
                }
            });
            if (!isLunatoneInPlay) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Solrock = Solrock;
