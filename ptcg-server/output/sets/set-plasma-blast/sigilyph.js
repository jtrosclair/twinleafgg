"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sigilyph = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sigilyph extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.resistance = [{ type: F, value: -20 }];
        this.powers = [
            {
                name: 'Toolbox',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon may have up to 4 Pokémon Tool cards attached to it. ' +
                    '(If this Pokémon loses this Ability, discard Pokémon Tool cards attached to this Pokémon until only 1 Pokémon Tool card remains.)'
            }
        ];
        this.attacks = [{ name: 'Cutting Wind', cost: [P, C, C], damage: 70, text: '' }];
        this.set = 'PLB';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sigilyph';
        this.fullName = 'Sigilyph PLB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card !== this) {
                        return;
                    }
                    // Ref: set-phantasmal-flames/rotom-ex.ts (dynamic maxTools from Ability)
                    const abilityBlocked = (0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this);
                    this.maxTools = abilityBlocked ? 1 : 4;
                    while (cardList.tools.length > this.maxTools) {
                        const tool = cardList.tools[cardList.tools.length - 1];
                        cardList.moveCardTo(tool, player.discard);
                    }
                });
            });
        }
        return state;
    }
}
exports.Sigilyph = Sigilyph;
