"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArvensMabosstiffex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArvensMabosstiffex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Arven\'s Maschiff';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ARVENS];
        this.cardType = D;
        this.hp = 270;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Hustle Tackle',
                cost: [C],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokemon has no damage counters on it, this attack does 120 more damage.'
            },
            {
                name: 'Boss\'s Headbutt',
                cost: [C, C, C],
                damage: 210,
                text: 'During your next turn, this Pokémon can\'t use Boss\'s Headbutt.'
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.name = 'Arven\'s Mabosstiff ex';
        this.fullName = 'Arven\'s Mabosstiff ex DRI';
    }
    reduceEffect(store, state, effect) {
        // Hustle Tackle
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.active.damage === 0) {
                effect.damage += 120;
            }
        }
        // Boss's Headbutt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Boss\'s Headbutt')) {
                player.active.cannotUseAttacksNextTurnPending.push('Boss\'s Headbutt');
            }
        }
        return state;
    }
}
exports.ArvensMabosstiffex = ArvensMabosstiffex;
