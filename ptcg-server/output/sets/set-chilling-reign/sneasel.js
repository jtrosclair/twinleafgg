"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sneasel extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.RAPID_STRIKE];
        this.cardType = game_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Cut Down',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'CRE';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    // Defending Pokemon has no energy cards attached
                    // Check if any card in energies array has energyType property (works for both EnergyCard and Pokemon-as-energy)
                    if (!opponent.active.energies.cards.some(c => c.energyType !== undefined)) {
                        return state;
                    }
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active.energies, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        return store.reduceEffect(state, new attack_effects_1.DiscardCardsEffect(effect, [card]));
                    });
                }
            });
            return state;
        }
        return state;
    }
}
exports.Sneasel = Sneasel;
