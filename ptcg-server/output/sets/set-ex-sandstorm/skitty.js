"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skitty = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skitty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Energy Catch',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for a basic Energy card, show it to your opponent, and put it into your hand.'
            },
            {
                name: 'Double-edge',
                cost: [C, C],
                damage: 30,
                text: 'Skitty does 10 damage to itself.'
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Skitty';
        this.fullName = 'Skitty SS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (!player.discard.cards.some(card => card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.BASIC)) {
                return state;
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false }), selected => {
                if (selected) {
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, selected);
                    prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: selected });
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
        }
        return state;
    }
}
exports.Skitty = Skitty;
