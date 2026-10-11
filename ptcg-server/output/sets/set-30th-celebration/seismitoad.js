"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seismitoad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const effect_of_attack_prefabs_1 = require("../../game/store/prefabs/effect-of-attack-prefabs");
class Seismitoad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Palpitoad';
        this.hp = 160;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Quaking Fist',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 60,
                text: 'During your opponent\'s next turn, whenever they try to use a Trainer card from their hand, they flip a coin. If tails, your opponent discards that Trainer card instead of using it.'
            },
            {
                name: 'Mega Punch',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Seismitoad';
        this.fullName = 'Seismitoad 30C';
    }
    reduceEffect(store, state, effect) {
        // Quaking Fist
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, effect_of_attack_prefabs_1.OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS)(store, state, effect, this);
        }
        return state;
    }
}
exports.Seismitoad = Seismitoad;
