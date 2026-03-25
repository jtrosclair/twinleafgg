"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinkatuff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tinkatuff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Tinkatink';
        this.attacks = [{
                name: 'Light Punch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Boundless Power',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'During your next turn, this Pokemon can\'t attack.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Tinkatuff';
        this.fullName = 'Tinkatuff PAL';
    }
    reduceEffect(store, state, effect) {
        // Boundless Power
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Tinkatuff = Tinkatuff;
