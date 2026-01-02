"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WashRotom = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class WashRotom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Manual Wash',
                cost: [L],
                damage: 20,
                text: 'Heal 10 damage from each of your Pokémon.'
            }, {
                name: 'Gadget Show',
                cost: [C, C],
                damage: 30,
                text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokémon.',
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wash Rotom';
        this.fullName = 'Wash Rotom DRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let toolCount = 0;
            [player.active, ...player.bench].forEach(list => {
                list.cards.forEach(card => {
                    if (card instanceof game_1.PokemonCard && card.tools.length > 0) {
                        toolCount += card.tools.length;
                    }
                });
            });
            effect.damage = 30 * toolCount;
        }
        return state;
    }
}
exports.WashRotom = WashRotom;
