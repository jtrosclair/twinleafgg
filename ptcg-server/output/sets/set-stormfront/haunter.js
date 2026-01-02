"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D, value: +20 }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Smog',
                cost: [],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned.'
            },
            {
                name: 'Hoodwink',
                cost: [P],
                damage: 30,
                text: 'You may search your opponent\'s discard pile for up to 3 in any combination of Trainer, Supporter, or Stadium cards and put them into your opponent\'s hand.'
            }
        ];
        this.set = 'SF';
        this.setNumber = '40';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Haunter';
        this.fullName = 'Haunter SF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasValidCard = opponent.discard.cards.some(c => {
                return c instanceof game_1.TrainerCard &&
                    (c.trainerType === card_types_1.TrainerType.SUPPORTER ||
                        c.trainerType === card_types_1.TrainerType.ITEM ||
                        c.trainerType === card_types_1.TrainerType.STADIUM);
            });
            if (!hasValidCard) {
                return state;
            }
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (c instanceof game_1.TrainerCard &&
                    (c.trainerType === card_types_1.TrainerType.SUPPORTER ||
                        c.trainerType === card_types_1.TrainerType.ITEM ||
                        c.trainerType === card_types_1.TrainerType.STADIUM)) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.discard, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 3, allowCancel: true, blocked }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: opponent.name, card: card.name });
                    });
                    prefabs_1.MOVE_CARDS(store, state, opponent.discard, opponent.hand, { cards: cards });
                }
            });
        }
        return state;
    }
}
exports.Haunter = Haunter;
