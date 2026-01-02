"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsZekrom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class NsZekrom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.NS];
        this.cardType = N;
        this.hp = 130;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Shred',
                cost: [C, C, C],
                damage: 70,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Rampage Thunder',
                cost: [R, L, L, C],
                damage: 250,
                text: 'This Pokemon can\'t attack during your next turn.'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.name = 'N\'s Zekrom';
        this.fullName = 'N\'s Zekrom M2a';
    }
    reduceEffect(store, state, effect) {
        // Rampage Thunder - prevent attack next turn
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.NsZekrom = NsZekrom;
