"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrocksZubat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BrocksZubat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.BROCKS];
        this.cardType = G;
        this.hp = 30;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Alert',
                cost: [C],
                damage: 0,
                text: 'Draw a card. Then, switch Brock\'s Zubat with 1 of your Benched Pokémon.You can\'t use this attack if your Bench is empty.'
            },
            {
                name: 'Wing Attack',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Brock\'s Zubat';
        this.fullName = 'Brock\'s Zubat G1';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (playerBench === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            prefabs_1.DRAW_CARDS(player, 1);
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        }
        return state;
    }
}
exports.BrocksZubat = BrocksZubat;
