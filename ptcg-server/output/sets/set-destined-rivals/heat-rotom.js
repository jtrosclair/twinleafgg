"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatRotom = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class HeatRotom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Singe',
                cost: [R],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }, {
                name: 'Gadget Show',
                cost: [C, C],
                damage: 30,
                text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokémon.',
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '43';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Heat Rotom';
        this.fullName = 'Heat Rotom DRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.BURNED]);
                state = store.reduceEffect(state, specialConditionEffect);
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
exports.HeatRotom = HeatRotom;
