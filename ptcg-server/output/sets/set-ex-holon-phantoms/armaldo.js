"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Armaldo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Armaldo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Anorith';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.additionalCardTypes = [card_types_1.CardType.METAL];
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Delta Edge',
                cost: [M, C],
                damage: 70,
                text: 'If you have any Supporter cards in play, this attack\'s base damage is 20 instead of 70.'
            },
            {
                name: 'Fossil Charge',
                cost: [F, C, C],
                damage: 50,
                text: 'You may discard a Claw Fossil, Mysterious Fossil, Root Fossil, or Holon Fossil from your hand. If you do, choose 1 of your opponent\'s Benched Pokémon and do 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'HP';
        this.fullName = 'Armaldo HP';
        this.name = 'Armaldo';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.player.supporterTurn > 0) {
                effect.damage = 20;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (card.name === 'Claw Fossil' || card.name === 'Mysterious Fossil' || card.name === 'Root Fossil' || card.name === 'Holon Fossil') {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            if (blocked.length === player.hand.cards.length) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 0, max: 1, blocked }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: this, sourceEffect: this.attacks[1] });
                attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state);
            });
        }
        return state;
    }
}
exports.Armaldo = Armaldo;
