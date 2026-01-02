"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ditto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dittobolic',
                powerType: game_1.PowerType.POKEBODY,
                text: 'The number of Benched Pokémon your opponent can have is now 4. If your opponent has 5 Benched Pokémon, your opponent must discard 1 of them and all cards attached to it.'
            }];
        this.attacks = [{
                name: 'Sharp Point',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Ditto';
        this.fullName = 'Ditto TM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            let isOpponentDittoInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isOpponentDittoInPlay = true;
                }
            });
            if (!isOpponentDittoInPlay) {
                return state;
            }
            if (!prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                effect.benchSizes = state.players.map((player, index) => {
                    if (player === owner) {
                        return effect.benchSizes[index];
                    }
                    return Math.min(effect.benchSizes[index], 4);
                });
            }
        }
        return state;
    }
}
exports.Ditto = Ditto;
