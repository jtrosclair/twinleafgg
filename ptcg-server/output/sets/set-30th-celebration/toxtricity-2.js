"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxtricity2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Toxtricity2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Toxel';
        this.hp = 140;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Light Punch',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 40,
                text: ''
            },
            {
                name: 'Thunderous Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'During your next turn, this Pokémon can\'t use attacks.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Toxtricity';
        this.fullName = 'Toxtricity 30C 60';
    }
    reduceEffect(store, state, effect) {
        // Thunderous Bolt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Toxtricity2 = Toxtricity2;
