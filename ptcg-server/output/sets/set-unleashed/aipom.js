"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aipom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aipom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tail Code',
                cost: [C],
                damage: 0,
                text: 'Move an Energy card attached to the Defending Pokémon to another of your opponent\'s Pokémon.'
            },
            {
                name: 'Tail Smash',
                cost: [C, C],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'UL';
        this.setNumber = '43';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Aipom';
        this.fullName = 'Aipom UL';
    }
    reduceEffect(store, state, effect) {
        // Surprise Punch - move opponent's energy after attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            const hasEnergy = opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (!hasBenched || !hasEnergy) {
                return state;
            }
            // Get blocked indices for non-energy cards
            const blocked = [];
            opponent.active.cards.forEach((card, index) => {
                if (card.superType !== card_types_1.SuperType.ENERGY) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return;
                }
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                    if (targets && targets.length > 0) {
                        opponent.active.moveCardTo(cards[0], targets[0]);
                    }
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Aipom = Aipom;
