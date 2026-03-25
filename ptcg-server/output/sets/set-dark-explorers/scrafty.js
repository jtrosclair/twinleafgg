"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrafty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Scrafty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scraggy';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Headbutt',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Crushing Blow',
                cost: [D, D, C],
                damage: 70,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.name = 'Scrafty';
        this.fullName = 'Scrafty DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
    }
    reduceEffect(store, state, effect) {
        // Crushing Blow - flip for energy discard
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const opponentActive = opponent.active;
                    const energyCards = opponentActive.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    if (energyCards.length > 0) {
                        const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, energyCards.slice(0, 1));
                        discardEffect.target = opponentActive;
                        store.reduceEffect(state, discardEffect);
                    }
                }
            });
        }
        return state;
    }
}
exports.Scrafty = Scrafty;
