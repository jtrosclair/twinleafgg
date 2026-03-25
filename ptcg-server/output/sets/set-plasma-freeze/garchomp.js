"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garchomp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Garchomp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gabite';
        this.cardType = N;
        this.hp = 140;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Mach Cut',
                cost: [F],
                damage: 60,
                text: 'Discard a Special Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Dragonblade',
                cost: [W, F],
                damage: 100,
                text: 'Discard the top 2 cards of your deck.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '120';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garchomp';
        this.fullName = 'Garchomp PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Mach Cut - discard a Special Energy from defending
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if defending has special energy
            const hasSpecialEnergy = opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.SPECIAL);
            if (hasSpecialEnergy) {
                // Build blocked list for non-special energy cards
                const blocked = [];
                opponent.active.cards.forEach((c, index) => {
                    if (c.superType !== card_types_1.SuperType.ENERGY || c.energyType !== card_types_1.EnergyType.SPECIAL) {
                        blocked.push(index);
                    }
                });
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                    if (selected && selected.length > 0) {
                        opponent.active.moveCardTo(selected[0], opponent.discard);
                    }
                });
            }
        }
        // Attack 2: Dragonblade - discard top 2 cards of your deck
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, player, 2, this, effect);
        }
        return state;
    }
}
exports.Garchomp = Garchomp;
