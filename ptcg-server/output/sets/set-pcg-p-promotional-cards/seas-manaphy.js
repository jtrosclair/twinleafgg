"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasManaphy = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class SeasManaphy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hypnosplash',
                cost: [W],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Miraculous Light',
                cost: [W, C],
                damage: 20,
                text: 'Remove 1 damage counter and all Special Conditions from Sea\'s Manaphy.'
            }];
        this.set = 'PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.name = 'Sea\'s Manaphy';
        this.fullName = 'Sea\'s Manaphy PCGP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 10);
            const conditions = effect.target.specialConditions.slice();
            conditions.forEach((condition) => {
                effect.target.removeSpecialCondition(condition);
            });
        }
        return state;
    }
}
exports.SeasManaphy = SeasManaphy;
