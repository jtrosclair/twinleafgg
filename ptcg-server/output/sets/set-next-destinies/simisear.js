"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simisear = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Simisear extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pansear';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Collect',
                cost: [R],
                damage: 0,
                text: 'Draw 3 cards.'
            },
            {
                name: 'Stadium Burn',
                cost: [R, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If there is any Stadium card in play, this attack does 30 more damage and the Defending Pokémon is now Burned.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '16';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Simisear';
        this.fullName = 'Simisear NXD';
    }
    reduceEffect(store, state, effect) {
        // Collect - draw 3 cards
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 3);
        }
        // Stadium Burn - bonus damage and burn if stadium in play
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Check if there's a stadium in play
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage += 30;
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Simisear = Simisear;
