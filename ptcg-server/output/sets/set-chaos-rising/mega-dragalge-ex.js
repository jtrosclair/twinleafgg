"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaDragalgeex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class MegaDragalgeex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skrelp';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.MEGA];
        this.hp = 330;
        this.cardType = N;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Corrosive Liquid',
                cost: [C, C],
                damage: 0,
                text: 'Discard all Pokemon Tool cards and Special Energy from all of your opponent\'s Pokemon.'
            },
            {
                name: 'Pernicious Poison',
                cost: [W, D],
                damage: 0,
                text: 'Your opponent\'s Active Pokemon is now Poisoned. During Pokemon Checkup, put 16 damage counters on that Pokemon instead of 1.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.usSetNumber = 'POR 63';
        this.name = 'Mega Dragalge ex';
        this.fullName = 'Mega Dragalge ex M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                [...cardList.tools].forEach(t => cardList.moveCardTo(t, opponent.discard));
                const specialEnergy = cardList.cards.filter(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL);
                specialEnergy.forEach(e => cardList.moveCardTo(e, opponent.discard));
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
            opponent.active.poisonDamage = 160;
        }
        return state;
    }
}
exports.MegaDragalgeex = MegaDragalgeex;
