"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klinklang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Klinklang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Klang';
        this.cardType = M;
        this.hp = 150;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Charge Beam',
                cost: [M],
                damage: 30,
                text: 'Attach an Energy card from your discard pile to this Pokémon.'
            },
            {
                name: 'Zap Cannon',
                cost: [M, C, C],
                damage: 80,
                text: 'Flip a coin. If tails, this Pokémon can\'t use Zap Cannon during your next turn.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Klinklang';
        this.fullName = 'Klinklang EPO';
        this.ZAP_CANNON_MARKER = 'ZAP_CANNON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergy = player.discard.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (hasEnergy) {
                return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }), cards => {
                    cards = cards || [];
                    if (cards.length > 0) {
                        player.discard.moveCardsTo(cards, player.active);
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.active.marker.hasMarker(this.ZAP_CANNON_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    player.active.marker.addMarker(this.ZAP_CANNON_MARKER, this);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.removeMarker(this.ZAP_CANNON_MARKER, this);
        }
        return state;
    }
}
exports.Klinklang = Klinklang;
