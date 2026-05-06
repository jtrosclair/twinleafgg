"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Muk = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Muk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grimer';
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.PSYCHIC }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Poison Sacs',
                powerType: game_1.PowerType.ABILITY,
                text: 'The Special Condition Poisoned is not removed when your opponent\'s Pokémon evolve or devolve.'
            }];
        this.attacks = [{
                name: 'Toxic Secretion',
                cost: [game_1.CardType.PSYCHIC],
                damage: 40,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Muk';
        this.fullName = 'Muk TEU';
    }
    reduceEffect(store, state, effect) {
        // Poison Sacs - prevent poison from being removed on evolution
        if (effect instanceof check_effects_1.CheckSpecialConditionRemovalEffect && effect.target.specialConditions.includes(game_1.SpecialCondition.POISONED)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const mukOwner = game_1.StateUtils.findOwner(state, cardList);
            const opponent = game_1.StateUtils.getOpponent(state, mukOwner);
            // Check if the evolving Pokémon belongs to the opponent
            if (effect.player === opponent) {
                let mukInPlay = false;
                mukOwner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list) => {
                    if (list.getPokemonCard() === this) {
                        mukInPlay = true;
                    }
                });
                if (mukInPlay && !(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, mukOwner, this)) {
                    if (!effect.preservedConditions.includes(game_1.SpecialCondition.POISONED)) {
                        effect.preservedConditions.push(game_1.SpecialCondition.POISONED);
                    }
                }
            }
        }
        // Toxic Secretion - apply double poison (20 damage instead of 10)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this, 20);
        }
        return state;
    }
}
exports.Muk = Muk;
