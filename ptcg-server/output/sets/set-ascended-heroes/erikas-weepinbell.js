"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasWeepinbell = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ErikasWeepinbell extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Erika\'s Bellsprout';
        this.tags = [game_1.CardTag.ERIKAS];
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Melt',
                cost: [G],
                damage: 30,
                text: ''
            },
            {
                name: 'Leafy Cyclone',
                cost: [G, C],
                damage: 70,
                text: 'During your next turn, this Pokémon can\'t use attacks.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Erika\'s Weepinbell';
        this.fullName = 'Erika\'s Weepinbell MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.ErikasWeepinbell = ErikasWeepinbell;
