"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vulpix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Vulpix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W, value: 10 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Reheat',
                cost: [],
                damage: 0,
                text: 'Discard up to 2 Energy cards from your hand. For each card you discarded, draw 2 cards.'
            },
            {
                name: 'Confuse Ray',
                cost: [R, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            },
        ];
        this.set = 'PL';
        this.name = 'Vulpix';
        this.fullName = 'Vulpix PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 2 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                player.hand.moveCardsTo(cards, player.discard);
                // Perform an action for each energy card discarded
                cards.forEach(() => {
                    (0, prefabs_1.DRAW_CARDS)(player, 2);
                });
                return state;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result => {
                if (result) {
                    (0, attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
                }
            }));
        }
        return state;
    }
}
exports.Vulpix = Vulpix;
