"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoroark = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zoroark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zorua';
        this.hp = 120;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Night Escape Route',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, your Active Pokémon\'s retreat cost is [C][C] less.'
            }];
        this.attacks = [{
                name: 'Slash Claw',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Zoroark';
        this.fullName = 'Zoroark 30C';
    }
    reduceEffect(store, state, effect) {
        // Carry and Run
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const isBenched = player.bench.some(b => b.cards.includes(this) && b.getPokemonCard() === this);
            if (!isBenched) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            for (let i = 0; i < 2; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
        }
        return state;
    }
}
exports.Zoroark = Zoroark;
