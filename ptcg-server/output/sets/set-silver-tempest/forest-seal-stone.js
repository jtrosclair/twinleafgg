"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestSealStone = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ForestSealStone extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.regulationMark = 'F';
        this.name = 'Forest Seal Stone';
        this.fullName = 'Forest Seal Stone SIT';
        this.text = 'The Pokémon V this card is attached to can use the VSTAR Power on this card.';
        this.powers = [
            {
                name: 'Star Alchemy',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                text: 'During your turn, you may search your deck for a card and put it into your hand. Then, shuffle your deck. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.useWhenAttached = true;
        this.VSTAR_MARKER = 'VSTAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect &&
            !effect.powers.find(p => p.name === this.powers[0].name)) {
            // Find the PokemonCardList that contains the target PokemonCard
            const cardList = game_1.StateUtils.findCardList(state, effect.target);
            if (cardList instanceof pokemon_card_list_1.PokemonCardList && cardList.tools.includes(this)) {
                const hasValidCard = effect.target.tags.some(tag => tag === card_types_1.CardTag.POKEMON_V ||
                    tag === card_types_1.CardTag.POKEMON_VSTAR ||
                    tag === card_types_1.CardTag.POKEMON_VMAX ||
                    tag === card_types_1.CardTag.POKEMON_VUNION);
                if (!hasValidCard) {
                    return state;
                }
                // Try to reduce ToolEffect, to check if something is blocking the tool from working
                try {
                    const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.powers.push(this.powers[0]);
            }
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            player.usedVSTAR = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
            return state;
        }
        return state;
    }
}
exports.ForestSealStone = ForestSealStone;
