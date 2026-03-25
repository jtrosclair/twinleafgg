"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aegislashex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aegislashex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Doublade';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Peerless Edge',
                cost: [card_types_1.CardType.METAL],
                damage: 70,
                text: 'This attack does 70 damage for each Prize card you have taken.'
            },
            {
                name: 'Double-Edged Slash',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 220,
                text: 'This Pokémon also does 30 damage to itself.'
            },
        ];
        this.set = 'PAR';
        this.setNumber = '135';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'G';
        this.name = 'Aegislash ex';
        this.fullName = 'Aegislash ex PAR';
    }
    reduceEffect(store, state, effect) {
        // Peerless Edge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.damage = 70 * (6 - player.getPrizeLeft());
        }
        // Double-Edged Slash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Legacy implementation:
            // - Created PutDamageEffect for 30 and targeted player.active directly.
            //
            // Converted to prefab version (THIS_POKEMON_DOES_DAMAGE_TO_ITSELF).
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Aegislashex = Aegislashex;
