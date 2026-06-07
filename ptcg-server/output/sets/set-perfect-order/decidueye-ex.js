"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decidueyeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Decidueyeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dartrix';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 320;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Sniper Eye',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent has exactly 4 cards in their hand, ignore all [C] in this Pokemon\'s attack costs.'
            }];
        this.attacks = [{
                name: 'Crush Arrow',
                cost: [G, C, C, C],
                damage: 240,
                text: 'Discard an Energy from your opponent\'s Active Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.usSetNumber = 'POR 12';
        this.name = 'Decidueye ex';
        this.fullName = 'Decidueye ex M3';
        this.SNIPER_EYE_MARKER = 'SNIPER_EYE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Ability: Ignore [C] in attack costs if opponent has exactly 4 cards
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 4) {
                // Remove all [C] from the cost
                const cost = effect.cost;
                while (cost.includes(card_types_1.CardType.COLORLESS)) {
                    const index = cost.indexOf(card_types_1.CardType.COLORLESS);
                    cost.splice(index, 1);
                }
            }
        }
        // Attack: Discard an Energy from opponent's Active Pokemon
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.energies.cards.length === 0) {
                return state;
            }
            const blocked = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    opponent.active.moveCardsTo(cards, opponent.discard);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SNIPER_EYE_MARKER, this)) {
            effect.player.marker.removeMarker(this.SNIPER_EYE_MARKER, this);
        }
        return state;
    }
}
exports.Decidueyeex = Decidueyeex;
