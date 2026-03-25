"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ekans = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ekans extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Acid Spray',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 30,
                text: ' Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Ekans';
        this.fullName = 'Ekans MEW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Opponent Active Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
                if (result) {
                    let cards = [];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = opponent.active;
                        return store.reduceEffect(state, discardEnergy);
                    });
                }
                else {
                    return state;
                }
            });
        }
        return state;
    }
}
exports.Ekans = Ekans;
