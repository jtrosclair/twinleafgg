"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magneton = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magnemite';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Junk Magnet',
                cost: [L],
                damage: 0,
                text: 'Put up to 2 Item cards from your discard pile into your hand.'
            },
            {
                name: 'Head Bolt',
                cost: [L, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Magneton';
        this.fullName = 'Magneton MEW';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 0, max: 2, allowCancel: false }), selected => {
                if (selected) {
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, selected);
                    prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: selected });
                }
            });
        }
        return state;
    }
}
exports.Magneton = Magneton;
