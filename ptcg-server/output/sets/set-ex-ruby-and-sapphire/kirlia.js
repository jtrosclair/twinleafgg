"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Kirlia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Removal Beam',
                cost: [P],
                damage: 10,
                text: 'Flip a coin. If heads, discard 1 Energy card attached to the Defending Pokémon.'
            },
            {
                name: 'Super Psy',
                cost: [P, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia RS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }), selected => {
                        const card = selected[0];
                        if (!card) {
                            return;
                        }
                        opponent.active.moveCardTo(card, opponent.discard);
                    });
                }
            });
        }
        return state;
    }
}
exports.Kirlia = Kirlia;
