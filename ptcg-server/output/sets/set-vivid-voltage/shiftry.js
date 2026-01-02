"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shiftry = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shiftry extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nuzleaf';
        this.cardType = G;
        this.hp = 150;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Shiftry Substitution',
                text: 'As long as this Pokémon is in the Active Spot, each Supporter card in your opponent\'s hand has the effect "Draw 3 cards." (This happens instead of the card\'s usual effect.)',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Fan Tornado',
                cost: [G, C],
                damage: 110,
                damageCalculation: 'x',
                text: 'You may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon.'
            }];
        this.regulationMark = 'D';
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Shiftry';
        this.fullName = 'Shiftry VIV';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            // owner of shiftry
            const player = game_1.StateUtils.findOwner(state, cardList);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // if shiftry's player played card, don't block it
            if (effect.player === player) {
                return state;
            }
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            // Check if Shiftry is active
            if (player.active === cardList) {
                // Check supporter turn counter BEFORE we process the effect
                const supporterTurn = effect.player.supporterTurn;
                if (supporterTurn > 0) {
                    throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
                }
                // Prevent the original PlaySupporterEffect from executing
                effect.preventDefault = true;
                // Move the supporter card to the supporter pile
                effect.player.hand.moveCardTo(effect.trainerCard, effect.player.supporter);
                // Apply our "draw 3 cards" effect instead
                opponent.deck.moveTo(opponent.hand, 3);
                // Move the supporter card to discard
                effect.player.supporter.moveCardTo(effect.trainerCard, effect.player.discard);
                // Increment supporter turn counter
                effect.player.supporterTurn += 1;
                return state;
            }
            return state;
        }
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                        if (targets && targets.length > 0) {
                            opponent.active.clearEffects();
                            opponent.switchPokemon(targets[0]);
                            return state;
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Shiftry = Shiftry;
