"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arcanine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Arcanine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Growlithe';
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Crunch',
                cost: [R, C],
                damage: 30,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Heat Blast',
                cost: [R, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Arcanine';
        this.fullName = 'Arcanine NXD 13';
    }
    reduceEffect(store, state, effect) {
        // Crunch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
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
exports.Arcanine = Arcanine;
