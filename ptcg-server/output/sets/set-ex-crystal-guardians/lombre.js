"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lombre = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lombre extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lotad';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Plunder',
                cost: [C, C],
                damage: 30,
                text: 'Before doing damage, discard all Trainer cards attached to the Defending Pokémon.'
            },
            {
                name: 'Wave Splash',
                cost: [W, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Lombre';
        this.fullName = 'Lombre CG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activePokemon = opponent.active;
            if (activePokemon.tools.length > 0) {
                activePokemon.moveCardsTo([...activePokemon.tools], opponent.discard);
            }
            opponent.active.cards.forEach(card => {
                if (card.superType === card_types_1.SuperType.TRAINER) {
                    opponent.active.moveCardTo(card, opponent.discard);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Lombre = Lombre;
