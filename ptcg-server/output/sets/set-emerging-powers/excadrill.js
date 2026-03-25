"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Excadrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Excadrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drilbur';
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Metal Claw',
                cost: [C],
                damage: 30,
                text: ''
            },
            {
                name: 'Drill Run',
                cost: [F, F, F],
                damage: 80,
                text: 'Discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Excadrill';
        this.fullName = 'Excadrill EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active;
            const energyCards = opponentActive.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            if (energyCards.length > 0) {
                opponentActive.moveCardTo(energyCards[0], opponent.discard);
            }
        }
        return state;
    }
}
exports.Excadrill = Excadrill;
