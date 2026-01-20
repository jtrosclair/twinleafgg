"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mamoswine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Mamoswine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Piloswine';
        this.cardType = W;
        this.hp = 180;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Wreck',
                cost: [C, C, C],
                damage: 120,
                damageCalculation: '+',
                text: 'If a Stadium is in play, this attack does 120 more damage. Then, discard that Stadium.'
            },
            {
                name: 'Blizzard Edge',
                cost: [W, C, C, C],
                damage: 200,
                text: 'Discard 2 Energy from this Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Mamoswine';
        this.fullName = 'Mamoswine PFL';
    }
    reduceEffect(store, state, effect) {
        // Wreck
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard) {
                effect.damage += 120;
                // Discard the Stadium
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const owner = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(owner.discard);
            }
        }
        // Blizzard Edge
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
        }
        return state;
    }
}
exports.Mamoswine = Mamoswine;
