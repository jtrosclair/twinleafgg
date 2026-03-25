"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewtwoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mewtwoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Energy Absorption',
                cost: [P],
                damage: 0,
                text: 'Attach up to 2 Energy cards from your discard pile to Mewtwo ex.'
            },
            {
                name: 'Psyburn',
                cost: [P, P, C],
                damage: 60,
                text: ''
            }];
        this.set = 'RS';
        this.setNumber = '101';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mewtwo ex';
        this.fullName = 'Mewtwo ex RS 10';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Energy Absorption
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const energyCards = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            if (energyCards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 2, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    player.discard.moveCardTo(selected[0], player.active);
                }
            });
        }
        return state;
    }
}
exports.Mewtwoex = Mewtwoex;
