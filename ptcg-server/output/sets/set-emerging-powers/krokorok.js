"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Krokorok = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Krokorok extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sandile';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Crunch',
                cost: [F, C, C],
                damage: 40,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Krokorok';
        this.fullName = 'Krokorok EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const opponentActive = opponent.active;
                    const energyCards = opponentActive.cards.filter(c => c.superType === game_1.SuperType.ENERGY);
                    if (energyCards.length > 0) {
                        const energyToDiscard = energyCards[0];
                        opponentActive.moveCardTo(energyToDiscard, opponent.discard);
                    }
                }
            });
        }
        return state;
    }
}
exports.Krokorok = Krokorok;
