"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salazzle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Salazzle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Salandit';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Hot Poison',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may leave your opponent\'s Active Pokémon Burned and Poisoned.'
            }];
        this.attacks = [
            {
                name: 'Flamethrower',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Discard an Energy from this Pokémon.',
            }
        ];
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Salazzle';
        this.fullName = 'Salazzle GRI';
    }
    reduceEffect(store, state, effect) {
        // Hot Poison ability
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        // Flamethrower attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Salazzle = Salazzle;
