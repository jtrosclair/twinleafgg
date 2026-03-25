"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accelgor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Accelgor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shelmet';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Acid Spray',
                cost: [G],
                damage: 20,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Deck and Cover',
                cost: [C, C],
                damage: 50,
                text: 'The Defending Pokémon is now Paralyzed and Poisoned. Shuffle this Pokémon and all cards attached to it into your deck.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Accelgor';
        this.fullName = 'Accelgor NVI';
    }
    reduceEffect(store, state, effect) {
        // Acid Spray - flip to discard opponent's energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const oppEnergy = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    if (oppEnergy.length === 0) {
                        return;
                    }
                    if (oppEnergy.length === 1) {
                        opponent.active.moveCardTo(oppEnergy[0], opponent.discard);
                        return;
                    }
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        if (selected && selected.length > 0) {
                            opponent.active.moveCardTo(selected[0], opponent.discard);
                        }
                    });
                }
            });
        }
        // Deck and Cover - paralyze, poison, shuffle self into deck
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Apply special conditions
            const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [
                card_types_1.SpecialCondition.PARALYZED,
                card_types_1.SpecialCondition.POISONED
            ]);
            store.reduceEffect(state, addSpecialCondition);
        }
        // Shuffle this Pokémon and all attached cards into deck (after attack)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            return (0, attack_effects_2.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK)(store, state, effect);
        }
        return state;
    }
}
exports.Accelgor = Accelgor;
