"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gurdurr = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gurdurr extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Timburr';
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Low Kick',
                cost: [F],
                damage: 30,
                text: ''
            },
            {
                name: 'Hammer Arm',
                cost: [F, C, C],
                damage: 60,
                text: 'Discard the top card of your opponent\'s deck.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gurdurr';
        this.fullName = 'Gurdurr SV11B';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[1] });
        }
        return state;
    }
}
exports.Gurdurr = Gurdurr;
