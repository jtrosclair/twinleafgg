"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowstic = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Meowstic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Espurr';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Perplex',
                cost: [P],
                damage: 0,
                text: 'Your opponent\'s Active Pokemon is now Confused.'
            },
            {
                name: 'Psychic',
                cost: [P],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.usSetNumber = 'POR 34';
        this.name = 'Meowstic';
        this.fullName = 'Meowstic M3';
    }
    reduceEffect(store, state, effect) {
        // Perplex - confuse opponent's Active Pokemon
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Psychic - damage based on opponent's energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            const energyCount = opponent.active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY).length;
            effect.damage = 30 + (energyCount * 30);
        }
        return state;
    }
}
exports.Meowstic = Meowstic;
