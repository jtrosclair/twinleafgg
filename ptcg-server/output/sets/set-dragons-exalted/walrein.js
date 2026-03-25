"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Walrein = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Walrein extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Sealeo';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Aurora Beam',
                cost: [W, C, C],
                damage: 80,
                text: ''
            },
            {
                name: 'Ice Entomb',
                cost: [W, W, C, C],
                damage: 60,
                text: 'The Defending Pokémon is now Paralyzed. This Pokémon can\'t use Ice Entomb during your next turn.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Walrein';
        this.fullName = 'Walrein DRX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Ice Entomb')) {
                player.active.cannotUseAttacksNextTurnPending.push('Ice Entomb');
            }
        }
        return state;
    }
}
exports.Walrein = Walrein;
