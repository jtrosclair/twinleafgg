"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Milotic = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Milotic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Feebas';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Dew Guard',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to you or your hand.'
            }];
        this.attacks = [{
                name: 'Double Smash',
                cost: [W, C],
                damage: 70,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 70 damage for each heads.'
            }];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Milotic';
        this.fullName = 'Milotic EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.MoveCardsEffect) {
            // Check if a Supporter is being played
            if (effect.sourceCard instanceof game_1.TrainerCard && effect.sourceCard.trainerType === card_types_1.TrainerType.SUPPORTER) {
                // Find the player who owns the source card (the one playing the Supporter)
                const sourceCardList = game_1.StateUtils.findCardList(state, effect.sourceCard);
                const sourcePlayer = game_1.StateUtils.findOwner(state, sourceCardList);
                const targetPlayer = game_1.StateUtils.getOpponent(state, sourcePlayer);
                // Check if Milotic is in play for the target player (the one being protected)
                let isMiloticInPlay = false;
                targetPlayer.forEachPokemon(game_1.PlayerType.ANY, (list, card) => {
                    if (card === this) {
                        if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetPlayer, this)) {
                            return;
                        }
                        isMiloticInPlay = true;
                    }
                });
                if (!isMiloticInPlay) {
                    return state;
                }
                if (effect.source === targetPlayer.hand) {
                    effect.preventDefault = true;
                    return state;
                }
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 70 * heads;
            });
        }
        return state;
    }
}
exports.Milotic = Milotic;
