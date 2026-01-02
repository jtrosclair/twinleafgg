"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesScraggy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MarniesScraggy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.MARNIES];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Crunch',
                cost: [D, D, C],
                damage: 50,
                text: 'Discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '132';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marnie\'s Scraggy';
        this.fullName = 'Marnie\'s Scraggy DRI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // If defending Pokemon has no energy cards attached, return early
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            let card;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                card = selected[0];
                return store.reduceEffect(state, new attack_effects_1.DiscardCardsEffect(effect, [card]));
            });
        }
        return state;
    }
}
exports.MarniesScraggy = MarniesScraggy;
