"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothitelle2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Gothitelle2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gothorita';
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Smack',
                cost: [P],
                damage: 30,
                text: ''
            },
            {
                name: 'Mental Shock',
                cost: [P, C, C],
                damage: 60,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Gothitelle';
        this.fullName = 'Gothitelle EPO 48';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
                }
                else {
                    const energyCards = opponent.active.cards.filter(c => c.superType === game_1.SuperType.ENERGY);
                    if (energyCards.length > 0) {
                        opponent.active.moveCardTo(energyCards[0], opponent.discard);
                    }
                }
            });
        }
        return state;
    }
}
exports.Gothitelle2 = Gothitelle2;
