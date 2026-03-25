"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunatone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lunatone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = F;
        this.weakness = [{ type: G }];
        this.hp = 110;
        this.retreat = [C];
        this.powers = [{
                name: 'Lunar Cycle',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if you have Solrock in play, you may discard a Basic [F] Energy card from your hand in order to use this Ability. Draw 3 cards. You can\'t use more than 1 Lunar Cycle Ability each turn.'
            }];
        this.attacks = [{
                name: 'Power Gem',
                cost: [F, F],
                damage: 50,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Lunatone';
        this.fullName = 'Lunatone M1L';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.usedLunarCycle == true) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let isSolrockInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Solrock') {
                    isSolrockInPlay = true;
                }
            });
            if (!isSolrockInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Fighting Energy';
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                (0, prefabs_1.DRAW_CARDS)(player, 3);
                player.usedLunarCycle = true;
                (0, prefabs_1.ABILITY_USED)(player, this);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                player.usedLunarCycle = false;
            }
        }
        return state;
    }
}
exports.Lunatone = Lunatone;
