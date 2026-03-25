"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wochien = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wochien extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hazardous Greed',
                cost: [G, C],
                damage: 20,
                text: 'If there are 3 or fewer cards in your deck, this attack also ' +
                    'does 120 damage to 2 of your opponent\'s Benched Pokémon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Entangling Whip',
                cost: [G, G, C],
                damage: 130,
                text: 'Discard the top 3 cards of your deck.'
            }
        ];
        this.set = 'SSP';
        this.name = 'Wo-Chien';
        this.fullName = 'Wo-chien SSP';
        this.setNumber = '15';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Hazardous Greed
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length <= 3) {
                const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
                if (benched === 0) {
                    return state;
                }
                const count = Math.min(2, benched);
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: count, max: count }), targets => {
                    targets.forEach(target => {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 120);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    });
                });
            }
        }
        // Entangling Whip
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Legacy implementation:
            // - Moved top 3 cards directly from deck to discard.
            //
            // Converted to prefab version (DISCARD_TOP_X_CARDS_FROM_YOUR_DECK).
            return (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, player, 3, this, effect);
        }
        return state;
    }
}
exports.Wochien = Wochien;
