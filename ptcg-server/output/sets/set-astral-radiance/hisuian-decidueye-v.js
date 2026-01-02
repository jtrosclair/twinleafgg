"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianDecidueyeV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class HisuianDecidueyeV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 220;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Mountain Hunt',
                cost: [F],
                damage: 0,
                text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Close-Quarters Shooting',
                cost: [F, C, C],
                damage: 100,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Hisuian Decidueye V';
        this.fullName = 'Hisuian Decidueye V ASR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 0, max: 2 }, this.attacks[0]);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 100);
        }
        return state;
    }
}
exports.HisuianDecidueyeV = HisuianDecidueyeV;
