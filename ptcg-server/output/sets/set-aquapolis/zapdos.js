"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdos = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Anti-Lightning',
                powerType: game_1.PowerType.POKEBODY,
                text: 'You can\'t attach [L] Energy cards from your hand to Zapdos.'
            }];
        this.attacks = [{
                name: 'Plasma',
                cost: [C],
                damage: 10,
                text: 'If there are any [L] Energy cards in your discard pile, flip a coin. If heads, attach 1 of them to Zapdos.'
            },
            {
                name: 'Burning Tail',
                cost: [L, L, C, C],
                damage: 60,
                text: 'Flip a coin. If tails, put 2 damage counters on Zapdos.'
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Zapdos';
        this.fullName = 'Zapdos AQ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            if (effect.energyCard.provides.includes(card_types_1.CardType.LIGHTNING)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.LIGHTNING))) {
                prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                    if (result) {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, provides: [card_types_1.CardType.LIGHTNING] }, { min: 1, max: 1, allowCancel: false }), cards => {
                            cards = cards || [];
                            if (cards.length > 0) {
                                prefabs_1.MOVE_CARDS(store, state, player.discard, player.active, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
                            }
                        });
                    }
                });
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (!result) {
                    player.active.damage += 20; // Apply 2 damage counters
                }
            });
        }
        return state;
    }
}
exports.Zapdos = Zapdos;
