"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiratinaEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class GiratinaEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 180;
        this.weakness = [{ type: N }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Shred',
                cost: [G, P, C],
                damage: 90,
                text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pokemon.'
            },
            {
                name: 'Dragon Pulse',
                cost: [G, P, C, C],
                damage: 130,
                text: 'Discard the top 3 cards of your deck.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '92';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Giratina-EX';
        this.fullName = 'Giratina-EX DRX';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Shred - ignore effects on defending Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 90);
        }
        // Attack 2: Dragon Pulse - discard top 3 cards of your deck
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, player, 3, this, effect);
        }
        return state;
    }
}
exports.GiratinaEx = GiratinaEx;
