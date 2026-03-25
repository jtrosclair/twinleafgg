"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lampent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lampent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litwick';
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ember',
                cost: [R, C],
                damage: 40,
                text: 'Flip a coin. If tails, discard an Energy attached to this Pokémon.'
            }];
        this.set = 'NXD';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lampent';
        this.fullName = 'Lampent NXD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    const energyCards = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    if (energyCards.length > 0) {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                            selected.forEach(card => {
                                player.active.moveCardTo(card, player.discard);
                            });
                        });
                    }
                }
            });
        }
        return state;
    }
}
exports.Lampent = Lampent;
