"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frogadier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Frogadier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Froakie';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Water Duplicates',
                cost: [W],
                damage: 0,
                text: 'Search your deck for up to 3 Frogadier and put them onto your Bench. Shuffle your deck afterward.'
            }];
        this.set = 'BKP';
        this.name = 'Frogadier';
        this.fullName = 'Frogadier BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { name: 'Frogadier' }, { min: 0, max: 3 });
        }
        return state;
    }
}
exports.Frogadier = Frogadier;
